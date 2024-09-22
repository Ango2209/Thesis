import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BaseServices } from 'src/common/base.services';
import { BaseController } from 'src/common/base.controller';
import { MedicineService } from './medicine.services';
import { Medicine, MedicineDocument } from './schemas/medicine.schema';
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

  @Get('available')
  async getMedicinesWithAvailableQuantity(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<any> {
    const pageNumber = parseInt(page, 10) || 1; // default page = 1
    const limitNumber = parseInt(limit, 10) || 10; // default quantity limit = 1
    return this.medicineService.getMedicinesWithAvailableQuantity(
      pageNumber,
      limitNumber,
    );
  }

  // get batches by medicine id
  @Get(':id/batches')
  async getBatchesByMedicineId(@Param('id') medicineId: string): Promise<any> {
    return this.medicineService.getBatchesByMedicineId(medicineId);
  }

  @Get('search')
  async searchMedicines(@Query('name') name: string): Promise<Medicine[]> {
    return this.medicineService.findMedicinesByName(name);
  }
}
