import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PatientService } from './patient.services';
import { PatientDocument } from './schemas/patient.schemas';
import { BaseController } from 'src/common/base.controller';
import { UploadService } from 'src/upload/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePatientDto } from './dto/createPatientDto';
import { MedicalRecord } from './schemas/medical-record.schema';
import { MedicalRecordDto } from './dto/createMedicalRecordDto';

@Controller('patients')
export class PatientController extends BaseController<PatientDocument> {
  constructor(
    private readonly patientService: PatientService,
    private readonly uploadService: UploadService,
  ) {
    super(patientService);
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createDoctor(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() createDto: CreatePatientDto,
  ): Promise<PatientDocument> {
    if (file && !this.uploadService.isImageFile(file)) {
      throw new BadRequestException('Only image files are allowed.');
    }

    const filePath = file
      ? await this.uploadService.saveFile(file)
      : 'defaultAvatar.jpg'; //check file

    return this.patientService.create({ ...createDto, avatar: filePath });
  }

  @Get('findByName/:name')
  async findPatientByName(
    @Param('name') name: string,
  ): Promise<PatientDocument[]> {
    return this.patientService.findByName(name);
  }

  @Get('patientId/:id')
  async getByPatientId(
    @Param('id') patient_id: string,
  ): Promise<PatientDocument> {
    return this.patientService.findByPatientId(patient_id);
  }

  @Post(':id/medical-records')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addMedicalRecord(
    @Param('id') patientId: string,
    @Body() record: MedicalRecordDto,
  ): Promise<PatientDocument> {
    return this.patientService.addMedicalRecord(patientId, record);
  }

  @Get(':id/medical-records')
  async getMedicalRecordsByPatientId(
    @Param('id') id: string,
  ): Promise<MedicalRecord[]> {
    return this.patientService.getMedicalRecordsByPatientIdObj(id);
  }

  @Get('prescriptions')
  async getRecordsByDate(
    @Query('date') date: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return await this.patientService.getMedicalRecordsByDate(date);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<any> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.patientService.findAllPatients(pageNumber, limitNumber);
  }
}
