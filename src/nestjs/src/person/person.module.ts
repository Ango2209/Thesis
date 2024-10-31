import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.services';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.services';
import { Doctor, DoctorSchema } from './schemas/doctor.schema';
import { Patient, PatientSchema } from './schemas/patient.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from './schemas/person.schemas';
import { UploadModule } from 'src/upload/upload.module';
import { PersonService } from './person.services';
import { MedicineModule } from 'src/medicine/medicine.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Person.name, schema: PersonSchema },
    ]),
    UploadModule,
    MedicineModule,
  ],
  controllers: [PatientController, DoctorController],
  providers: [PatientService, DoctorService,PersonService],
  exports: [PatientService, DoctorService,PersonService],
})
export class PersonModule {}
