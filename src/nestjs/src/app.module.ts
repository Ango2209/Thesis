import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from './schedules/schedule.module';
import { PersonModule } from './person/person.module';
import { ContractModule } from './contract/contract.module';
import { RatingModule } from './ratings/rating.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Anhngo2208:Anhngole.123@cluster0.onhfeyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ContractModule,
    RatingModule,
    ScheduleModule,
    PersonModule,
    ContractModule,
    UploadModule
  ],
})
export class AppModule {}
