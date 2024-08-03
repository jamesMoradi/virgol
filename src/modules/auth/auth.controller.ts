import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto, CheckOtp } from './dto/auth.dto';
import { SwaggerConsumees } from 'src/common/types/enums/swagger-consumes.enum';
import { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
@ApiTags('User')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('user-existence')
  @ApiConsumes(SwaggerConsumees.UrlEncoded, SwaggerConsumees.Json)
  userExistence (@Body() authDto : AuthDto, @Res() res : Response) {
    return this.authService.userExistence(authDto, res)
  }

  @Post('ceck-otp')
  @ApiConsumes(SwaggerConsumees.UrlEncoded, SwaggerConsumees.Json)
  checkOtp(@Body() checkOtp : CheckOtp) {
    return this.authService.checkOtp(checkOtp.code)
  }

  @Get('check-login')
  @ApiBearerAuth("Authorization")
  @UseGuards(AuthGuard)
  checkLogin(@Req() req : Request){
    return req.user
  }
}
