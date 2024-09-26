import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateMedicalTestDto {
  @IsMongoId()
  @IsNotEmpty()
  service: string;

  @IsMongoId()
  @IsNotEmpty()
  doctor: string;

  @IsMongoId()
  @IsNotEmpty()
  patient: string;

  @IsMongoId()
  @IsNotEmpty()
  appointment: string;

  @IsString()
  @IsNotEmpty()
  initialDiagnosis: string;

  @IsString()
  notes: string;
}
