import {
  IsDate,
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsMongoId,
  IsDateString,
} from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  prescription: string;

  @IsArray()
  @IsOptional()
  attachments: string[];

  @IsMongoId()
  @IsNotEmpty()
  doctor_objid: string;
}
