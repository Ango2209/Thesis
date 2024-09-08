import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { BaseController } from '../common/base.controller';
import { DoctorService } from './doctor.services';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';
import { CreateDoctorDto } from './dto/createDoctorDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';

@Controller('doctors')
export class DoctorController extends BaseController<DoctorDocument> {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly uploadService: UploadService,
  ) {
    super(doctorService);
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createDoctor(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() createDto: CreateDoctorDto,
  ): Promise<DoctorDocument> {
    if (file && !this.uploadService.isImageFile(file)) {
      throw new BadRequestException('Only image files are allowed.');
    }

    const filePath = file
      ? await this.uploadService.saveFile(file)
      : 'defaultAvatar.jpg'; //check file

    return this.doctorService.create({ ...createDto, avatar: filePath });
  }

  @Get('findByName/:name')
  async findDoctorByName(
    @Param('name') name: string,
  ): Promise<DoctorDocument[]> {
    return this.doctorService.findByName(name);
  }
}
