import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from './schedules/schedule.module';
import { PersonModule } from './person/person.module';
import { ContractModule } from './contract/contract.module';
import { RatingModule } from './ratings/rating.module';
import { AppointmentModule } from './appointment/appointment.module';
import { MedicineModule } from './medicine/medicine.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { BlogModule } from './blog/blog.module';
import { MulterModule } from '@nestjs/platform-express';
import { NotificationModule } from './notifications/notification.module';
import { MedicalServicesModule } from './medical-services/medical-services.module';
import { MedicalTestsModule } from './medical-tests/medical-tests.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Anhngo2208:Anhngole.123@cluster0.onhfeyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        limits: {
          fieldSize: parseInt(configService.get<string>('MAX_FIELD_SIZE'), 10), // Kích thước trường dữ liệu
          fileSize: parseInt(
            configService.get<string>('MAX_SIZE_PER_FILE_UPLOAD'),
            10,
          ), // Kích thước file
          files: parseInt(
            configService.get<string>('MAX_NUMBER_FILE_UPLOAD'),
            10,
          ), // Số lượng file tối đa
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ContractModule,
    RatingModule,
    ScheduleModule,
    PersonModule,
    ContractModule,
    AppointmentModule,
    MedicineModule,
    UploadModule,
    BlogModule,
    NotificationModule,
    MedicalServicesModule,
    MedicalTestsModule
  ],
})
export class AppModule {}
