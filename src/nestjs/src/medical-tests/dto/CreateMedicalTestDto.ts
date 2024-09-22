import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateMedicalTestDto {
  @IsMongoId()
  service: string;

  @IsMongoId()
  doctor: string;

  @IsMongoId()
  patient: string;

  @IsMongoId()
  appointment: string;

  @IsString()
  initialDiagnosis: string;

  @IsString()
  notes: string;

  @IsString()
  conclude: string;

  attachments: string[];
}
