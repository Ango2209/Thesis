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
  record_date: Date;

  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @IsString()
  @IsNotEmpty()
  complaint: string;

  @IsString()
  @IsNotEmpty()
  treatment: string;

  @IsString()
  @IsNotEmpty()
  vital_signs: string;

  @IsArray()
  @IsOptional()
  prescriptions: CreatePrescriptionItemDto[] = [];

  @IsArray()
  @IsOptional()
  attachments: string[];

  @IsMongoId()
  @IsNotEmpty()
  doctor_objid: string;
}
