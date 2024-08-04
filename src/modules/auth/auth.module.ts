import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { TokenServices } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { OtpEntity } from '../user/entity/otp.entity';
import { ProfileEntity } from '../user/entity/profile.entity';

@Module({
  imports : [TypeOrmModule.forFeature([UserEntity, OtpEntity, ProfileEntity]),AuthModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenServices],
  exports : [AuthService, JwtService, TokenServices, TypeOrmModule]
})
export class AuthModule {}
