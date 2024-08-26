import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Medicine, MedicineSchema } from './schemas/medicine.schema';
import { MedicineController } from './medicine.controller';
import { MedicineService } from './medicine.services';
import { Batch, BatchSchema } from './schemas/batch.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medicine.name, schema: MedicineSchema },
      { name: Batch.name, schema: BatchSchema },
    ]),
  ],
  controllers: [MedicineController],
  providers: [MedicineService],
  exports: [MedicineService]
})
export class MedicineModule {}
