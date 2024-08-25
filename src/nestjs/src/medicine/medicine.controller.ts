import {
  Controller,
  Injectable,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BaseServices } from 'src/common/base.services';
import { BaseController } from 'src/common/base.controller';
import { MedicineService } from './medicine.services';
import { MedicineDocument } from './schemas/medicine.schemas';
import { CreateMedicineDto } from './dto/createMedicineDto';

@Controller('medicines')
export class MedicineController extends BaseController<MedicineDocument> {
  constructor(private readonly medicineService: MedicineService) {
    super(medicineService);
  }

  @Post(':id/medical-records')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addMedicalRecord(
    medicine: CreateMedicineDto,
  ): Promise<MedicineDocument> {
    return this.medicineService.create(medicine);
  }
}
