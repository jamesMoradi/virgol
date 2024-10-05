import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ImagesService } from "./images.service";
import { ApiTags } from "@nestjs/swagger";
import { AuthDecorator } from "src/common/decorator/Auth.decorator";
import { ImagesDto } from "./dto/images.dto";
import { UploadFile } from "src/common/interceptor/upload.interceptor";
import { MulterFile } from "src/common/utils/multer.util";

@Controller()
@ApiTags('images')
@AuthDecorator()
export class ImagesController {
    constructor(private readonly imagesService : ImagesService){}

    @Post()
    @UseInterceptors(UploadFile('image', 'images'))
    create(@Body() imagesDto : ImagesDto, @UploadedFile() image : MulterFile){
        return this.imagesService.create(imagesDto, image)
    }
}