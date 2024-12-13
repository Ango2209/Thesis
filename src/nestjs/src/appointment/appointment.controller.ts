import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BaseController } from 'src/common/base.controller';
import { AppointmentDocument } from './schemas/appointment.schemas';
import { AppointmentService } from './appointment.services';
import { ChangeStatusDto } from './dto/changeStatus.dto';

@Controller('appointments')
export class AppointmentController extends BaseController<AppointmentDocument> {
  constructor(private readonly appointmentService: AppointmentService) {
    super(appointmentService);
  }
  @Post('create')
  async createInvoice(@Body() dto: any) {
    return await this.appointmentService.createAppointment(dto);
  }
  @Get('patient/:patientId')
  async getAppointmentsByPatientId(@Param('patientId') patientId: string) {
    return this.appointmentService.getAppointmentsByPatientId(patientId);
  }
  @Get('doctor/:doctorId')
  async getAppointmentsByDoctorId(@Param('doctorId') doctorId: string) {
    return this.appointmentService.getAppointmentsByDoctorId(doctorId);
  }

  @Get('filter')
  async getAppointments(
    @Query('statuses') statuses: string,
    @Query('date') date?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('doctorId') doctor_id: string = '',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const statusArray = statuses ? statuses.split(',') : [];
    return this.appointmentService.getAppointments(
      statusArray,
      date,
      pageNumber,
      limitNumber,
      doctor_id,
    );
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.appointmentService.changeStatus(id, changeStatusDto);
  }

  @Patch(':id/examined')
  async markAppointmentAsExamined(@Param('id') id: string) {
    return this.appointmentService.markAsExamined(id);
  }

  @Get('recent-patients')
  async getRecentPatients(): Promise<{ patient: any; updatedAt: string }[]> {
    return await this.appointmentService.getRecentPatients();
  }

  @Get('finished-appointments-stats')
  async getFinishedAppointmentsStats() {
    return await this.appointmentService.getLast7DaysFinishedAppointments();
  }
}
