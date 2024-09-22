import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import { CreateServiceDto } from './dto/CreateServiceDto';
import { UpdateServiceDto } from './dto/UpdateServiceDto';

@Injectable()
export class MedicalServiceService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  // Create a new service
  async createService(
    createServiceDto: CreateServiceDto,
  ): Promise<ServiceDocument> {
    const createdService = new this.serviceModel(createServiceDto);
    await createdService.save();
    return createdService;
  }

  // Get all services
  async getAllServices(): Promise<ServiceDocument[]> {
    return this.serviceModel.find({ isDeleted: false }).exec();
  }

  // Get service by ID
  async getServiceById(id: string): Promise<ServiceDocument> {
    const service = await this.serviceModel.findById(id).exec();
    if (!service || service.isDeleted) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }
  // Get service by status
  async getServicesByStatus(status: string): Promise<Service[]> {
    return this.serviceModel.find({ status, isDeleted: false }).exec();
  }

  // Update a service
  async updateService(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceDocument> {
    const service = await this.serviceModel.findById(id).exec();
    if (!service || service.isDeleted) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    if (updateServiceDto.isDeleted !== undefined) {
      throw new BadRequestException('Cannot update isDeleted field directly');
    }
    Object.assign(service, updateServiceDto);
    await service.save();
    return service;
  }

  // Soft delete a service
  async deleteService(id: string): Promise<ServiceDocument> {
    const service = await this.serviceModel.findById(id).exec();
    if (!service || service.isDeleted) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    service.isDeleted = true;
    await service.save();
    return service;
  }
}
