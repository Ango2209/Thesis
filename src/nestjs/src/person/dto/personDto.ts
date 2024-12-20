import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class PersonDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;
  @IsDateString()
  dob: Date;
  @IsString()
  address: string;
  @Transform(({ value }) => (value === 'true' || value === true ? true : false))
  @IsBoolean()
  @IsNotEmpty()
  gender: boolean;
  @IsString()
  @IsNotEmpty()
  phone: string;
  @IsEmail()
  email: string;
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsString()
  role: string

}
