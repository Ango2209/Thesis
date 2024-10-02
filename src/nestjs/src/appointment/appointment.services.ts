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

  async getAppointments(
    statuses?: string[],
    date?: string,
    page: number = 1,
    limit: number = 10,
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
      query.date_of_visit = { $gte: startOfDay, $lte: endOfDay };
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
}
