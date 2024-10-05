import { Injectable } from "@nestjs/common";
import {ImagesDto} from './dto/images.dto'
import { InjectRepository } from "@nestjs/typeorm";
import { ImagesEntity } from "./entity/images.entity";
import { Repository } from "typeorm";
import { MulterFile } from "src/common/utils/multer.util";

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(ImagesEntity)
        private readonly imagesRepository : Repository<ImagesEntity>
    ){}

    async create(imageDto : ImagesDto, image : MulterFile){}
}