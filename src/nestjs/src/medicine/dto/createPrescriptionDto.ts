import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePrescriptionItemDto {
  @IsString()
  @IsNotEmpty()
  medicineId: string;
  itemName: string;
  itemPrice: number;
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
  @IsString()
  @IsNotEmpty()
  dosage: string;
  @IsString()
  @IsNotEmpty()
  instraction: string;
  amount: number;
}
