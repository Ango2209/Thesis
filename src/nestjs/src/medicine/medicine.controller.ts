import {
  Body,
  Controller,
  Injectable,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BaseServices } from 'src/common/base.services';
import { BaseController } from 'src/common/base.controller';
import { MedicineService } from './medicine.services';
import { MedicineDocument } from './schemas/medicine.schema';
import { CreateMedicineDto } from './dto/createMedicineDto';
import { AddNewBatchDto } from './dto/addNewBatchDto';

@Controller('medicines')
export class MedicineController extends BaseController<MedicineDocument> {
  constructor(private readonly medicineService: MedicineService) {
    super(medicineService);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() medicine: CreateMedicineDto): Promise<MedicineDocument> {
    return this.medicineService.create(medicine);
  }

  @Post(':id/add-batch')
  async addNewBatch(
    @Param('id') id: string,
    @Body() addNewBatchDto: AddNewBatchDto,
  ): Promise<any> {
    return this.medicineService.addNewBatch(id, addNewBatchDto);
  }
}
