import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Appointment, AppointmentSchema } from "./schemas/appointment.schemas";
import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./appointment.services";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }])
    ],
    controllers: [AppointmentController],
    providers: [AppointmentService],
})

export class AppointmentModule { }