import { Model, Document } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BaseServices<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(createDto: any): Promise<T> {
    const createdEntity = new this.model(createDto);
    return createdEntity.save();
  }

  async findAll(): Promise<T[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<T> {
    const entity = await this.model.findById(id).exec();
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }
  async update(id: string, updateDto: any): Promise<T> {
    const updatedEntity = await this.model
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updatedEntity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return updatedEntity;
  }

  async delete(id: string): Promise<T> {
    const deletedEntity = await this.model.findByIdAndDelete(id).exec();
    if (!deletedEntity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return deletedEntity;
  }
}
