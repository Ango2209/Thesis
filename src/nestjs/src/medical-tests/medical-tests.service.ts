import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MedicalTest,
  MedicalTestDocument,
} from './schemas/medical-test.schema.';
import { CreateMedicalTestDto } from './dto/CreateMedicalTestDto';
import { UpdateMedicalTestDto } from './dto/UpdateMedicalTestDto';

@Injectable()
export class MedicalTestService {
  constructor(
    @InjectModel(MedicalTest.name)
    private medicalTestModel: Model<MedicalTestDocument>,
  ) {}

  async createMedicalTest(
    createMedicalTestDto: CreateMedicalTestDto,
  ): Promise<MedicalTest> {
    const medicalTest = new this.medicalTestModel(createMedicalTestDto);
    return medicalTest.save();
  }

  async getAllMedicalTests(): Promise<MedicalTest[]> {
    return this.medicalTestModel.find().exec();
  }

  async getMedicalTests(
    statuses: string[],
    date: string,
    page: number,
    limit: number,
  ): Promise<MedicalTest[]> {
    const query: any = {};

    if (statuses && statuses.length > 0) {
      query.status = { $in: statuses };
    }

    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const skip = (page - 1) * limit;

    const medicalTests = await this.medicalTestModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    if (!medicalTests.length) {
      throw new NotFoundException(
        'No medical tests found for the given criteria.',
      );
    }

    return medicalTests;
  }

  async getMedicalTestById(id: string): Promise<MedicalTest> {
    const medicalTest = await this.medicalTestModel.findById(id).exec();
    if (!medicalTest) {
      throw new NotFoundException(`MedicalTest with ID ${id} not found`);
    }
    return medicalTest;
  }

  async updateMedicalTest(
    id: string,
    updateMedicalTestDto: UpdateMedicalTestDto,
  ): Promise<MedicalTestDocument> {
    const medicalTest = await this.medicalTestModel.findById(id).exec();
    if (!medicalTest) {
      throw new NotFoundException(`MedicalTest with ID ${id} not found`);
    }
    Object.assign(medicalTest, updateMedicalTestDto);
    await medicalTest.save();
    return medicalTest;
  }
}
