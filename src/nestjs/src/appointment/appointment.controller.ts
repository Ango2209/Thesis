import { Controller, Injectable } from "@nestjs/common";
import { BaseController } from "src/common/base.controller";
import { AppointmentDocument } from "./schemas/appointment.schemas";
import { AppointmentService } from "./appointment.services";

@Controller('appointment')
export class AppointmentController extends BaseController<AppointmentDocument> {
    constructor(private readonly appointmentService: AppointmentService) {
        super(appointmentService);
    }
}