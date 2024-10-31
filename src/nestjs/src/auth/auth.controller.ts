import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response,Request } from 'express';
import { AuthService } from './auth.service';
import { CreatePatientDto } from 'src/person/dto/createPatientDto';
import { CreateDoctorDto } from 'src/person/dto/createDoctorDto';
import { PersonDto } from 'src/person/dto/personDto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginUserDto } from 'src/person/schemas/login-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

//   @Post('register/doctor')
//   async registerDoctor(@Body() createDoctorDto: CreatePatientDto) {
//     return this.authService.singUp({ ...createDoctorDto, role: 'doctor' });
//   }

//   @Post('register/patient')
//   async registerPatient(@Body()createPatientDto: CreateDoctorDto) {
//     console.log(createPatientDto);
//     return this.authService.singUp({ ...createPatientDto, role: 'patient' });
//   }
@Post('register')
async register(@Body() createUserDto: PersonDto) {
  const { role } = createUserDto;
  if (role !== 'doctor' && role !== 'patient' && role !== 'admin') {
    throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
  }
  return this.authService.singUp(createUserDto);
}
  @Post('/signIn')
//   @UseGuards(LocalAuthGuard)
  async singIn(
    @Body() userDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signIn(userDto);
    if (typeof result === 'string') return result;

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return result;
  }
  
  @Post('/update')
  async updateTokens(@Req() req: Request) {
    const { refreshToken } = req.cookies;

    const accessToken = await this.authService.updateAccessToken(refreshToken);

    if (!accessToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return accessToken;
  }
}