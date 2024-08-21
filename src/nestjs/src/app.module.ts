import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from './schedules/schedule.module';
import { PersonModule } from './person/person.module';
import { ContractModule } from './contract/contract.module';
import { RatingModule } from './ratings/rating.module';
import { AppointmentModule } from './appointment/appointment.module';
import { MedicineModule } from './medicine/medicine.module';
@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://Anhngo2208:Anhngole.123@cluster0.onhfeyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    ContractModule,
    RatingModule,
    ScheduleModule,
    PersonModule,
    ContractModule,
    AppointmentModule,
    MedicineModule],
})
export class AppModule { }
