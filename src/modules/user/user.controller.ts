import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangeEmailDto, ChangePhoneDto, ChangeUsernameDto, ProfileDto } from './dto/profile.dto';
import { ApiBearerAuth, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { SwaggerConsumees } from 'src/common/types/enums/swagger-consumes.enum';
import { multerConfig } from 'src/config/multer.config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProfileImages } from './types/files';
import { UploadedOptionalFiles } from 'src/common/decorator/uploadFile.decorator';
import { Response } from 'express';
import { CookieKeys } from 'src/common/types/enums/cookie.enum';
import { tokenOption } from 'src/common/utils/cookie.util';
import { PublicMessage } from 'src/common/types/enums/message.enum';
import { CheckOtpDto } from '../auth/dto/auth.dto';
import { AuthDecorator } from 'src/common/decorator/auth.decorator';
import { Pagination } from 'src/common/decorator/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('user')
@AuthDecorator()
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

  @Post('/verify-email-otp')
  verifyEmail(@Body() checkOtpDto : CheckOtpDto) {
    return this.userService.verifyEmail(checkOtpDto.code)
  }

  @Patch('/change-phone')
  async changePhone(@Body() phoneDto : ChangePhoneDto, @Res() res : Response){
    const {code, message, token} = await this.userService.changePhone(phoneDto.phone)
    if (message) return res.json(message)
    res.cookie(CookieKeys.PhoneOtp, token, tokenOption())
    res.json({code, message : PublicMessage.CodeSent})
  }

  @Post('/verify-phone-otp')
  verifyPhone(@Body() checkOtpDto : CheckOtpDto) {
    return this.userService.verifyPhone(checkOtpDto.code)
  }

  @Post('/change-username')
  changeUsername(@Body() usernameDto : ChangeUsernameDto, @Res() res : Response){
    return this.userService.changeUsername(usernameDto.username)
  }

  @Get('/follow/:id')
  @ApiParam({name : 'user'})
  follow(@Param('id', ParseIntPipe)id : number){
    return this.userService.followToggle(id)
  }

  @Get('/get-followers')
  @Pagination()
  getFollowers(@Query() paginationDto : PaginationDto){
    return this.userService.getFollowers(paginationDto)
  }

  @Get('/get-followings')
  @Pagination()
  getFollowings(@Query() paginationDto : PaginationDto){
    return this.userService.getFollowings(paginationDto)
  }
}
