import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseServices } from "src/common/base.services";
import { Appointment, AppointmentDocument } from "./schemas/appointment.schemas";

@Injectable()
export class AppointmentService extends BaseServices<AppointmentDocument> {
    constructor(@InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>) {
        super(appointmentModel)
    }
}
