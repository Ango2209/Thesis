import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalTest, MedicalTestSchema } from './schemas/medical-test.schema.';
import { MedicalTestService } from './medical-tests.service';
import { MedicalTestController } from './medical-tests.controller';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: MedicalTest.name, schema: MedicalTestSchema }]),
    ],
    controllers: [MedicalTestController],
    providers: [MedicalTestService],
  })
export class MedicalTestsModule {}
