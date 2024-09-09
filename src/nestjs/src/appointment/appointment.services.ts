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
    async getAppointmentsByPatientId(patient: string): Promise<any> {
        try {
          // Find all appointments for the patient and populate the doctor information
          return await this.appointmentModel
            .find({ patient: patient })
            .populate('doctor') // Assuming the 'doctor' field in the appointment model contains the doctor ID
            .exec();
        } catch (error) {
          throw new Error(error.message);
        }
      }
}
