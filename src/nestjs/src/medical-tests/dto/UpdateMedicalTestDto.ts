import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { MedicalTest } from '../schemas/medical-test.schema.';

export class UpdateMedicalTestDto extends PartialType(MedicalTest) {
  @IsOptional()
  @IsString()
  initialDiagnosis?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  conclude?: string;

  @IsOptional()
  @IsEnum([
    'awaiting payment',
    'awaiting transfer',
    'paid',
    'in progress',
    'completed',
    'cancelled',
  ])
  status?: string;

  @IsOptional()
  attachments?: string[];
}
