import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schemas';
import { BaseServices } from 'src/common/base.services';
import { MedicalRecord } from './schemas/medical-record.schema';
import { DoctorService } from './doctor.services';
import { MedicineService } from 'src/medicine/medicine.services';

@Injectable()
export class PatientService extends BaseServices<PatientDocument> {
  constructor(
    @InjectModel(Patient.name)
    private readonly patientModel: Model<PatientDocument>,
    private readonly doctorService: DoctorService,
    private readonly medicineService: MedicineService,
  ) {
    super(patientModel);
  }

  async create(createDto: any): Promise<PatientDocument> {
    // find max id doctor
    const lastPatient = await this.patientModel
      .findOne()
      .sort({ patient_id: -1 })
      .exec();

    let newPatientId = 'PT000001';
    // generate doctorid
    if (lastPatient && lastPatient.patient_id) {
      const currentCodeNumber = parseInt(lastPatient.patient_id.slice(2), 10);
      const nextCodeNumber = currentCodeNumber + 1;

      newPatientId = `PT${nextCodeNumber.toString().padStart(6, '0')}`;
    }

    const createdEntity = new this.patientModel({
      ...createDto,
      patient_id: newPatientId,
    });
    return createdEntity.save();
  }

  async findByPatientId(patient_id: string): Promise<PatientDocument> {
    const patient = await this.patientModel.findOne({ patient_id }).exec();
    if (!patient) {
      throw new NotFoundException(
        `Patient with Patient Code ${patient_id} not found`,
      );
    }
    return patient;
  }

  async findByName(fullname: string): Promise<PatientDocument[]> {
    const patients = await this.patientModel
      .find({ fullname: new RegExp(fullname, 'i') })
      .exec();
    return patients;
  }

  async addMedicalRecord(id: string, record: any): Promise<PatientDocument> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    // Check if the doctor_id is valid
    if (record.doctor_id_object) {
      const isValidDoctor = await this.doctorService.findOne(
        record.doctor_id_object.toString(),
      );
      if (!isValidDoctor) {
        throw new BadRequestException(
          `Invalid doctor ID: ${record.doctor_id_object}`,
        );
      }
    }

    // Handle prescription if provided
    if (record.prescriptions && record.prescriptions.length > 0) {
      try {
        const processedItems = await this.medicineService.prescribeMedicine(
          record.prescriptions,
        );
        record.prescriptions = processedItems; // Update with item name
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(
            `One or more medicines not found: ${error.message}`,
          );
        } else if (error instanceof BadRequestException) {
          throw new BadRequestException(`Prescription error: ${error.message}`);
        } else {
          throw new BadRequestException(
            'An unexpected error occurred while processing prescriptions',
          );
        }
      }
    }
    const recordCount = patient.medical_records.length + 1;
    const recordNumber = recordCount.toString().padStart(4, '0');
    const recordId = `MR${patient.patient_id}${recordNumber}`;
    record.record_id = recordId;
    patient.medical_records.push(record);
    return patient.save();
  }

  async findAllPatients(page: number, limit: number): Promise<any> {
    const skip = (page - 1) * limit;
    const patients = await this.patientModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();

    const totalPatients = await this.patientModel.countDocuments();

    return {
      totalPatients,
      totalPages: Math.ceil(totalPatients / limit),
      currentPage: page,
      patients,
    };
  }

  async getMedicalRecordsByPatientIdObj(id: string) {
    const patient = await this.patientModel
      .findById(id)
      .populate({
        path: 'medical_records.doctor',
        model: 'Doctor',
      })
      .exec();
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    const sortedRecords = patient.medical_records.sort(
      (a, b) =>
        new Date(b.record_date).getTime() - new Date(a.record_date).getTime(),
    );

    return sortedRecords;
  }

  // Hàm lấy medical records theo ngày và chỉ lấy các records có prescriptions
  async getMedicalRecordsByDate(
    date: string,
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      // Kiểm tra ngày hợp lệ
      const searchDate = new Date(date);
      if (isNaN(searchDate.getTime())) {
        throw new BadRequestException('Ngày không hợp lệ.');
      }

      // Đặt thời gian bắt đầu và kết thúc của ngày
      const startOfDay = new Date(searchDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(searchDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Lấy tất cả bệnh nhân có medical records trong ngày
      const patients = await this.patientModel
        .find({
          'medical_records.record_date': { $gte: startOfDay, $lte: endOfDay },
        })
        .populate({
          path: 'medical_records.doctor',
          select: 'fullname doctor_id',
        })
        .select('fullname patient_id medical_records phone _id');

      // Lọc ra các records có prescriptions và định dạng dữ liệu
      const allRecords = patients.flatMap((patient) =>
        patient.medical_records
          .filter((record) => record.prescriptions.length > 0) // Chỉ lấy các records có prescriptions
          .map((record) => ({
            patient: {
              patient_id: patient.patient_id,
              fullname: patient.fullname,
              phone: patient.phone,
            },
            doctor: record.doctor,
            record_date: record.record_date,
            record_id: record.record_id,
            prescriptions: record.prescriptions,
          })),
      );

      // Tính toán skip và limit trên kết quả cuối cùng
      const total = allRecords.length;
      const paginatedRecords = allRecords.slice(
        (page - 1) * limit,
        page * limit,
      );

      return {
        total, // Tổng số records
        page,
        limit,
        data: paginatedRecords,
      };
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      throw new Error('Không thể lấy medical records.');
    }
  }
  async findOneByUsername(username: string) {
    const user = await this.patientModel.findOne({ username });
    return user;
  }
}
