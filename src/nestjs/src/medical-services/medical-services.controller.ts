import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { Service } from './schemas/service.schema';
import { MedicalServiceService } from './medical-services.service';
import { CreateServiceDto } from './dto/CreateServiceDto';
import { UpdateServiceDto } from './dto/UpdateServiceDto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: MedicalServiceService) {}

  @Post()
  async createService(
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<Service> {
    return this.serviceService.createService(createServiceDto);
  }

  @Get()
  async getAllServices(): Promise<Service[]> {
    return this.serviceService.getAllServices();
  }

  @Get(':id')
  async getServiceById(@Param('id') id: string): Promise<Service> {
    const service = await this.serviceService.getServiceById(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  @Put(':id')
  async updateService(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    const service = await this.serviceService.updateService(
      id,
      updateServiceDto,
    );
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  @Delete(':id')
  async deleteService(@Param('id') id: string): Promise<void> {
    const result = await this.serviceService.deleteService(id);
    if (!result) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
  }
}
