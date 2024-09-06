import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  description: string;
  @IsString()
  @IsNotEmpty()
  categories: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  authorObjid: string;

  @IsEnum(['Doctor', 'Admin'])
  @IsNotEmpty()
  authorModel: string;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => (value === 'true' || value === true ? true : false))
  isVisible: boolean;
}
