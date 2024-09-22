import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Length,
} from 'class-validator';

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  @Length(1, 255)
  name?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  status?: string;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}
