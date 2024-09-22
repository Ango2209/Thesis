import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  patient_name: string;

  @IsNotEmpty()
  doctor: Types.ObjectId;

  @IsNotEmpty()
  patient: Types.ObjectId;

  @IsOptional()
  @IsString()
  purpose_visit?: string;

  @IsNotEmpty()
  date_of_visit: Date;

  @IsNotEmpty()
  start_time: string;

  @IsOptional()
  @IsBoolean()
  isExamined?: boolean;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  specialized: string;
}
