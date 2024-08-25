import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMedicineDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  measure: string;
  @IsNotEmpty()
  @IsString()
  description: string;
}
