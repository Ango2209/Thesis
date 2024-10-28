import {
    Injectable,
    UnauthorizedException,
    NotFoundException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  
  import * as bcrypt from 'bcryptjs';
  
  import { PersonService } from 'src/person/person.services';
  import { PersonDto } from 'src/person/dto/personDto';
  import { LoginUserDto } from 'src/person/schemas/login-user.dto';

  @Injectable()
  export class AuthService {
    constructor(
      private readonly personService: PersonService,
      private readonly jwtService: JwtService,
    ) {}
  
    async singUp(userDto: PersonDto) {
      const candidate = await this.personService.findOneByUsername(
        userDto.username,
      );
  
      if (candidate) return null;
  
      const hashedPassword = await bcrypt.hash(userDto.password, 7);
      const user = await this.personService.create({
        ...userDto,
        password: hashedPassword,
        is_verify: false,
      });
  
      const tokens = await this.generateTokens(user.id);
  
      return tokens;
    }
  
    async verifyEmail(accessToken: string) {
      const user = this.verifyAccessToken(accessToken);
      return await this.personService.update(user.id, { ...user, is_verify: true });
    }
  
    async signIn(userDto: LoginUserDto) {
      const user = await this.personService.findOneByUsername(userDto.username);
  
      const tokens = await this.generateTokens(user.id);
      return { user, tokens };
    }
  
    async validateUser(userDto: LoginUserDto) {
      const user = await this.personService.findOneByUsername(userDto.username);
      if (!user) {
        throw new NotFoundException(`There is no user under this username`);
      }
  
      const passwordEquals = await bcrypt.compare(
        userDto.password,
        user.password,
      );
      if (passwordEquals) return user;
  
      throw new UnauthorizedException({ message: 'Incorrect password' });
    }
  
    verifyAccessToken(accessToken: string) {
      try {
        const payload = this.jwtService.verify(accessToken, {
          secret: process.env.JWT_ACCESS_SECRET,
        });
  
        return payload;
      } catch (err) {
        return null;
      }
    }
  
    verifyRefreshToken(refreshToken: string) {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
  
      return payload;
    }
  
    async updateAccessToken(refreshToken: string) {
      try {
        const userId = this.verifyRefreshToken(refreshToken);
  
        const tokens = await this.generateTokens(userId);
  
        return tokens.accessToken;
      } catch (e) {
        return null;
      }
    }
  
    private async generateTokens(id: string) {
      const payload = { id };
  
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRE,
      });
      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRE,
      });
      const tokens = { accessToken, refreshToken };
  
      return tokens;
    }
    async refreshToken(refreshToken: string) {
      try {
        const payload = this.jwtService.verify(refreshToken, {
          secret: process.env.JWT_REFRESH_SECRET,
        }); // Cung cấp secret key
        const newAccessToken = this.jwtService.sign(
          { id: payload.id },
          {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_ACCESS_EXPIRE,
          },
        ); // Cung cấp secret key và thời gian hết hạn
        return newAccessToken;
      } catch (error) {
        throw new UnauthorizedException('Invalid refresh token');
      }
    }
  }
  