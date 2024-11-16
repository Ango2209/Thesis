import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MedicalTest,
  MedicalTestDocument,
} from './schemas/medical-test.schema.';
import { CreateMedicalTestDto } from './dto/CreateMedicalTestDto';
import { UpdateMedicalTestDto } from './dto/UpdateMedicalTestDto';

@Injectable()
export class MedicalTestService {
  constructor(
    @InjectModel(MedicalTest.name)
    private medicalTestModel: Model<MedicalTestDocument>,
  ) {}

  async generateMedicalTestId(): Promise<string> {
    const now = new Date();

    // Tạo thời gian Việt Nam từ UTC
    const vnTimezoneOffset = 7 * 60 * 60 * 1000;
    const vnDate = new Date(now.getTime() + vnTimezoneOffset);

    const year = vnDate.getFullYear().toString().slice(-2);
    const month = String(vnDate.getMonth() + 1).padStart(2, '0');
    const day = String(vnDate.getDate()).padStart(2, '0');
    const prefix = `MDT${year}${month}${day}`;

    // Tính khoảng thời gian từ đầu đến cuối ngày hiện tại (giờ VN)
    const startOfDay = new Date(vnDate.setHours(0, 0, 0, 0) - vnTimezoneOffset);
    const endOfDay = new Date(
      vnDate.setHours(23, 59, 59, 999) - vnTimezoneOffset,
    );

    // Đếm số bản ghi trong ngày (giờ VN)
    const countTodayRecords = await this.medicalTestModel.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    const orderNumber = String(countTodayRecords + 1).padStart(4, '0');
    return `${prefix}${orderNumber}`;
  }

  async createMedicalTest(
    createMedicalTestDto: CreateMedicalTestDto,
  ): Promise<MedicalTest> {
    const medicalTestId = await this.generateMedicalTestId();
    const medicalTest = new this.medicalTestModel({
      ...createMedicalTestDto,
      medicalTestId,
    });
    return medicalTest.save();
  }

  async getAllMedicalTests(): Promise<MedicalTest[]> {
    return this.medicalTestModel.find().exec();
  }

  async getMedicalTests(
    statuses: string[],
    date: string,
    page: number,
    limit: number,
  ): Promise<{
    medicalTests: MedicalTest[];
    total: number;
    totalPages: number;
  }> {
    const query: any = {};

    if (statuses && statuses.length > 0) {
      query.status = { $in: statuses };
    }

    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const skip = (page - 1) * limit;

    // total medicalTests
    const total = await this.medicalTestModel.countDocuments(query).exec();
    const totalPages = Math.ceil(total / 10);

    const medicalTests = await this.medicalTestModel
      .find(query)
      .populate('service')
      .populate('doctor')
      .populate({
        path: 'patient',
        select: '-medical_records',
      })
      .skip(skip)
      .limit(limit)
      .exec();

    return { medicalTests, total, totalPages };
  }

  async getMedicalTestById(id: string): Promise<MedicalTest> {
    const medicalTest = await this.medicalTestModel
      .findById(id)
      .populate('service')
      .populate('doctor')
      .populate({
        path: 'patient',
        select: '-medical_records',
      })
      .exec();
    if (!medicalTest) {
      throw new NotFoundException(`MedicalTest with ID ${id} not found`);
    }
    return medicalTest;
  }

  async updateMedicalTest(
    id: string,
    updateMedicalTestDto: UpdateMedicalTestDto,
  ): Promise<MedicalTestDocument> {
    const medicalTest = await this.medicalTestModel.findById(id).exec();
    if (!medicalTest) {
      throw new NotFoundException(`MedicalTest with ID ${id} not found`);
    }
    Object.assign(medicalTest, updateMedicalTestDto);
    await medicalTest.save();
    return medicalTest;
  }

  async getMedicalTestsByAppointmentId(
    appointmentId: string,
  ): Promise<MedicalTest[]> {
    const medicalTests = await this.medicalTestModel
      .find({ appointment: appointmentId })
      .populate('service')
      .exec();

    return medicalTests;
  }
}
