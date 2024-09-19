import { Controller, Get, Injectable, Param } from "@nestjs/common";
import { BaseController } from "src/common/base.controller";
import { AppointmentDocument } from "./schemas/appointment.schemas";
import { AppointmentService } from "./appointment.services";

@Controller('appointment')
export class AppointmentController extends BaseController<AppointmentDocument> {
    constructor(private readonly appointmentService: AppointmentService) {
        super(appointmentService);
    }
    @Get('/patient/:id')
    async getNotificationsByPatientId(@Param('id') id: string): Promise<any> {
        return this.appointmentService.getAppointmentsByPatientId(id);
    }
    @Get('/doctor/:id')
    async getNotificationsByDoctorId(@Param('id') id: string): Promise<any> {
        return this.appointmentService.getAppointmentsByDoctorId(id);
    }
}