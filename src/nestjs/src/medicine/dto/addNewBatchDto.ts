import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class AddNewBatchDto {
  @IsString()
  @IsNotEmpty()
  batchNumber: string;
  @IsNumber()
  quantityEntered: number;
  @IsDateString()
  expiryDate: Date;
  @IsNumber()
  purchasePrice: number;
}
