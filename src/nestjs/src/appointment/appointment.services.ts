import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BaseServices } from 'src/common/base.services';
import { ChangeStatusDto } from './dto/changeStatus.dto';
import {
  Appointment,
  AppointmentDocument,
} from './schemas/appointment.schemas';

@Injectable()
export class AppointmentService extends BaseServices<AppointmentDocument> {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {
    super(appointmentModel);
  }

  async changeStatus(
    id: string,
    changeStatusDto: ChangeStatusDto,
  ): Promise<Appointment> {
    const { status } = changeStatusDto;

    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(id, { status: status }, { new: true })
      .populate('doctor')
      .populate('patient')
      .exec();

    if (!updatedAppointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return updatedAppointment;
  }

  private async generateAppointmentId(): Promise<string> {
    const date = new Date();
    const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');

    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const appointmentCount = await this.appointmentModel.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    const orderNumber = (appointmentCount + 1).toString().padStart(4, '0');
    return `APM${datePart}${orderNumber}`; // Ví dụ: INV202410310001
  }

  async createAppointment(dto: any): Promise<Appointment> {
    const appointmentId = await this.generateAppointmentId();

    const newAppointment = new this.appointmentModel({
      appointmentId,
      ...dto,
    });
    return await newAppointment.save();
  }

  async getAppointments(
    statuses?: string[],
    date?: string,
    page: number = 1,
    limit: number = 10,
    doctor_id: string = '',
  ): Promise<{
    appointments: Appointment[];
    total: number;
    totalPages: number;
  }> {
    const validStatuses = [
      'booked',
      'waiting',
      'examining',
      'awaiting results',
      'finished',
      'medicined',
      'cancelled',
    ];
    const query: any = {};

    // Check valid statuses
    if (statuses) {
      if (!statuses.every((status) => validStatuses.includes(status))) {
        throw new Error(
          `Invalid statuses in the array. Valid statuses are: ${validStatuses.join(', ')}`,
        );
      }
      query.status = { $in: statuses };
    }

    // filter by date
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999); //24h
      console.log(startOfDay);
      console.log(endOfDay);

      query.date_of_visit = { $gte: startOfDay, $lte: endOfDay };
    }

    // Filter by doctor_id if provided
    if (doctor_id !== '') {
      query.doctor = doctor_id;
    }

    // pagination
    const skip = (page - 1) * limit;

    // total appointments
    const total = await this.appointmentModel.countDocuments(query).exec();
    const totalPages = Math.ceil(total / 10);

    // Get appointments by condition
    const appointments = await this.appointmentModel
      .find(query)
      .populate('doctor')
      .populate('patient')
      .skip(skip)
      .limit(limit)
      .exec();

    return { appointments, total, totalPages };
  }

  async markAsExamined(id: string): Promise<Appointment> {
    const updatedAppointment = await this.appointmentModel.findByIdAndUpdate(
      id,
      { isExamined: true },
      { new: true },
    );

    if (!updatedAppointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return updatedAppointment;
  }

  async findOne(id: string): Promise<AppointmentDocument> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate('doctor')
      .populate({
        path: 'patient',
        select: '-medical_records',
      })
      .exec();

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }
  async getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
    const appointments = await this.appointmentModel
      .find({ patient: patientId })
      .populate('doctor')
      .exec();

    if (!appointments.length) {
      throw new NotFoundException(
        `No appointments found for patient ID ${patientId}`,
      );
    }

    return appointments;
  }

  async getAppointmentsByDoctorId(patientId: string): Promise<Appointment[]> {
    const appointments = await this.appointmentModel
      .find({ doctor: patientId })
      .populate('patient')
      .exec();

    if (!appointments.length) {
      throw new NotFoundException(
        `No appointments found for patient ID ${patientId}`,
      );
    }

    return appointments;
  }

  async getRecentPatients(): Promise<{ patient: any; updatedAt: string }[]> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const recentPatients = await this.appointmentModel.aggregate([
      {
        $match: {
          updatedAt: { $gte: oneMonthAgo },
          status: { $nin: ['booked', 'cancel'] },
        },
      },
      {
        $sort: { updatedAt: -1 }, // Sắp xếp giảm dần theo thời gian cập nhật
      },
      {
        $group: {
          _id: '$patient', // Gom nhóm theo bệnh nhân
          updatedAt: { $first: '$updatedAt' }, // Lấy thời gian cập nhật mới nhất
        },
      },
      {
        $lookup: {
          from: 'patients', // Tên collection chứa dữ liệu bệnh nhân
          localField: '_id',
          foreignField: '_id',
          as: 'patientData',
        },
      },
      {
        $unwind: '$patientData', // Giải nén mảng patientData để lấy ra object bệnh nhân
      },
      {
        $sort: { updatedAt: -1 }, // Sắp xếp lại lần cuối theo updatedAt sau khi lấy đủ thông tin bệnh nhân
      },
      {
        $limit: 5, // Giới hạn 5 bệnh nhân
      },
    ]);

    // Định dạng dữ liệu trả về với updatedAt dưới dạng HH:MM
    return recentPatients.map((record) => ({
      patient: record.patientData,
      updatedAt: record.updatedAt,
    }));
  }

  async getLast7DaysFinishedAppointments() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6); // 7 ngày gần nhất

    const previousStartDate = new Date();
    previousStartDate.setDate(startDate.getDate() - 7); // 7 ngày trước đó
    const previousEndDate = new Date(startDate);

    // Truy vấn cho 7 ngày gần nhất
    const recentFinishedAppointmentsData =
      await this.appointmentModel.aggregate([
        {
          $match: {
            updatedAt: {
              $gte: startDate,
              $lte: endDate,
            },
            status: 'finished',
          },
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' },
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.date': 1 } },
      ]);

    // Truy vấn cho 7 ngày trước đó
    const previousFinishedAppointmentsData =
      await this.appointmentModel.aggregate([
        {
          $match: {
            updatedAt: {
              $gte: previousStartDate,
              $lte: previousEndDate,
            },
            status: 'finished',
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]);

    // Tạo mảng dữ liệu cho 7 ngày gần nhất và đảm bảo tất cả các ngày đều có giá trị
    const chartData = [];
    const labels = [];
    let recentTotal = 0;

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];

      const dayData = recentFinishedAppointmentsData.find(
        (day) => day._id.date === dateString,
      );
      const count = dayData ? dayData.count : 0;

      chartData.push(count);
      labels.push(dateString);
      recentTotal += count;
    }

    // Tổng số lịch khám "finished" trong 7 ngày trước đó
    const previousTotal = previousFinishedAppointmentsData[0]?.count || 0;

    // Tính phần trăm thay đổi
    const percentage = previousTotal
      ? ((recentTotal - previousTotal) / previousTotal) * 100
      : 0;

    return {
      title: 'Finished Appointments in the Last 7 Days',
      value: recentTotal,
      chartData,
      labels,
      percentage: Math.round(percentage * 100) / 100, // Làm tròn hai chữ số thập phân
    };
  }
}
