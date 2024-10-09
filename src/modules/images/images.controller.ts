import { Body, Controller, Delete, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ImagesService } from "./images.service";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthDecorator } from "src/common/decorator/auth.decorator";
import { ImagesDto } from "./dto/images.dto";
import { UploadFile } from "src/common/interceptor/upload.interceptor";
import { MulterFile } from "src/common/utils/multer.util";
import { SwaggerConsumees } from "src/common/types/enums/swagger-consumes.enum";

@Controller()
@ApiTags('images')
@AuthDecorator()
export class ImagesController {
    constructor(private readonly imagesService : ImagesService){}

    @Post()
    @ApiConsumes(SwaggerConsumees.MultiPartData)
    @UseInterceptors(UploadFile('image', 'images'))
    create(@Body() imagesDto : ImagesDto, @UploadedFile() image : MulterFile){
        return this.imagesService.create(imagesDto, image)
    }

    @Delete('/find-one/:id')
    findOne(@Param('id', ParseIntPipe) id : number){
        return this.imagesService.find(id)
    }

    @Delete('/find-all')
    findAll(){
        return this.imagesService.findAll()
    }

    @Delete('/delete/:id')
    delete(@Param('id', ParseIntPipe) id : number){
        return this.imagesService.remove(id)
    }
}