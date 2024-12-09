import {
  IsDate,
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsMongoId,
  IsDateString,
} from 'class-validator';
import { CreatePrescriptionItemDto } from 'src/medicine/dto/createPrescriptionDto';

export class MedicalRecordDto {
  @IsDateString()
  @IsNotEmpty()
  record_date?: Date;

  @IsString()
  @IsNotEmpty()
  diagnosis?: string;

  @IsString()
  @IsNotEmpty()
  complaint?: string;

  @IsString()
  @IsOptional()
  treatment?: string;

  @IsString()
  @IsOptional()
  vital_signs?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  prescriptions?: CreatePrescriptionItemDto[] = [];

  @IsArray()
  @IsOptional()
  attachments?: string[];

  @IsMongoId()
  @IsNotEmpty()
  doctor?: string;
  @IsMongoId()
  @IsNotEmpty()
  appointment?: string;
}
