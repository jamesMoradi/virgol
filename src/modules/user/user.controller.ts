import { Body, Controller, Get, Patch, Put, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangeEmailDto, ProfileDto } from './dto/profile.dto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { SwaggerConsumees } from 'src/common/types/enums/swagger-consumes.enum';
import { multerConfig } from 'src/config/multer.config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProfileImages } from './types/files';
import { UploadedOptionalFiles } from 'src/common/decorator/uploadFile.decorator';
import { Response } from 'express';
import { CookieKeys } from 'src/common/types/enums/cookie.enum';
import { tokenOption } from 'src/common/utils/cookie.util';
import { PublicMessage } from 'src/common/types/enums/message.enum';

@Controller('user')
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/profile')
  @ApiConsumes(SwaggerConsumees.MultiPartData)
  @UseInterceptors(multerConfig())
  changeProfile(
    @UploadedOptionalFiles() files : ProfileImages,
    @Body() profileDto : ProfileDto) {
    return this.userService.changeProfile(files,profileDto)
  }

  @Get('/profile')
  getProfile(){
    return this.userService.getProfile()
  }

  @Patch('/change-email')
  async changeEmail(@Body() changeEmailDto : ChangeEmailDto, @Res() res : Response){
    const {code, message, token} = await this.userService.changeEmail(changeEmailDto.email)
    if (message) return res.json(message)
    res.cookie(CookieKeys.EmailOtp, token, tokenOption())
    res.json({code, message : PublicMessage.CodeSent})
  }
}
