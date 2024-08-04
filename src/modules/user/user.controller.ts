import { Body, Controller, ParseFilePipe, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ProfileDto } from './dto/profile.dto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { SwaggerConsumees } from 'src/common/types/enums/swagger-consumes.enum';
import { multerConfig } from 'src/config/multer.config';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('user')
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/profile')
  @ApiConsumes(SwaggerConsumees.MultiPartData)
  @UseInterceptors(multerConfig())
  changeProfile(
    @UploadedFiles(new ParseFilePipe({
      fileIsRequired : false,
      validators : []
    })) files : any,
    @Body() profileDto : ProfileDto) {
    return this.userService.changeProfile(files,profileDto)
  }
}
