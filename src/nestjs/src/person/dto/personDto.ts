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
  @IsNotEmpty()
  address: string;
  //   @IsBoolean()
  //   gender: boolean;
  @IsString()
  @IsNotEmpty()
  phone: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
