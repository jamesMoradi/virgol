import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './entity/profile.entity';
import { UserEntity } from './entity/user.entity';
import { OtpEntity } from './entity/otp.entity';

@Module({
  imports : [TypeOrmModule.forFeature([UserEntity, OtpEntity, ProfileEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports : [UserService, TypeOrmModule]
})
export class UserModule {}
