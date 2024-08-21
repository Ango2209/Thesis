import { IsString } from 'class-validator';
import { PersonDto } from './personDto';

export class CreatePatientDto extends PersonDto {
  @IsString()
  blood_group: string;
  @IsString()
  anamesis: string;
}
