import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Patch,
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

  @Get('filter')
  async getAppointments(
    @Query('statuses') statuses: string,
    @Query('date') date?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const statusArray = statuses ? statuses.split(',') : [];
    return this.appointmentService.getAppointments(
      statusArray,
      date,
      pageNumber,
      limitNumber,
    );
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.appointmentService.changeStatus(id, changeStatusDto);
  }
}
