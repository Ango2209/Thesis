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
  quantity: number;
  @IsDateString()
  expiryDate: Date;
  @IsNumber()
  purchasePrice: number;
}
