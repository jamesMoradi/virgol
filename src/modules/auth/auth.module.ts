import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { TokenServices } from './token.service';

@Module({
  imports : [UserModule,AuthModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenServices],
})
export class AuthModule {}
