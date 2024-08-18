import { Module } from "@nestjs/common";
import { DoctorController } from "./doctor.controller";
import { DoctorService } from "./doctor.services";
import { PatientController } from "./patient.controller";
import { PatientService } from "./patient.services";
import { Doctor, DoctorSchema } from "./schemas/doctor.schema";
import { Patient, PatientSchema } from "./schemas/patient.schemas";
import { MongooseModule } from "@nestjs/mongoose";
import { Person, PersonSchema } from "./schemas/person.schemas";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Patient.name, schema: PatientSchema },
            { name: Doctor.name, schema: DoctorSchema },
            { name: Person.name, schema: PersonSchema },
        ]),
    ],
    controllers: [PatientController, DoctorController],
    providers: [PatientService, DoctorService],
    exports: [PatientService, DoctorService],
})
export class PersonModule { }
