import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MedicalTestService } from './medical-tests.service';
import { CreateMedicalTestDto } from './dto/CreateMedicalTestDto';
import { MedicalTest } from './schemas/medical-test.schema.';
import { UpdateMedicalTestDto } from './dto/UpdateMedicalTestDto';

@Controller('medical-tests')
export class MedicalTestController {
  constructor(private readonly medicalTestService: MedicalTestService) {}

  @Post()
  async createMedicalTest(
    @Body() createMedicalTestDto: CreateMedicalTestDto,
  ): Promise<MedicalTest> {
    return this.medicalTestService.createMedicalTest(createMedicalTestDto);
  }

  @Get()
  async getMedicalTests(
    @Query('statuses') statuses: string,
    @Query('date') date: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{
    medicalTests: MedicalTest[];
    total: number;
    totalPages: number;
  }> {
    const statusArray = statuses ? statuses.split(',') : [];
    return this.medicalTestService.getMedicalTests(statusArray, date, page, limit);
  }

  @Get(':id')
  async getMedicalTestById(@Param('id') id: string): Promise<MedicalTest> {
    return this.medicalTestService.getMedicalTestById(id);
  }

  @Put(':id')
  async updateMedicalTest(
    @Param('id') id: string,
    @Body() updateMedicalTestDto: UpdateMedicalTestDto,
  ): Promise<MedicalTest> {
    return this.medicalTestService.updateMedicalTest(id, updateMedicalTestDto);
  }
  @Get('appointment/:appointmentId')
  async getMedicalTestsByAppointmentId(
    @Param('appointmentId') appointmentId: string,
  ): Promise<MedicalTest[]> {
    const medicalTests =
      await this.medicalTestService.getMedicalTestsByAppointmentId(
        appointmentId,
      );
    return medicalTests;
  }
}
