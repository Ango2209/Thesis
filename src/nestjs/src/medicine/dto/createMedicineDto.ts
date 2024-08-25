import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMedicineDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNumber()
  price: number;
  @IsNumber()
  inStock: number;
  @IsString()
  @IsNotEmpty()
  measure: string;
}
