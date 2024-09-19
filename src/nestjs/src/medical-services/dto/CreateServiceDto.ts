import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description?: string;
}
