import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import {ImagesDto} from './dto/images.dto'
import { InjectRepository } from "@nestjs/typeorm";
import { ImagesEntity } from "./entity/images.entity";
import { Repository } from "typeorm";
import { MulterFile } from "src/common/utils/multer.util";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { NotFoundMessage, PublicMessage } from "src/common/types/enums/message.enum";

@Injectable({scope : Scope.REQUEST})
export class ImagesService {
    constructor(
        @Inject(REQUEST) private readonly req : Request,
        @InjectRepository(ImagesEntity)
        private readonly imagesRepository : Repository<ImagesEntity>
    ){}

    async create(imageDto : ImagesDto, image : MulterFile){
        const userId = this.req.user.id
        const {alt, name} = imageDto
        let location = image.path.slice(7)

        await this.imagesRepository.insert({
            alt : alt ?? name,
            name,
            location,
            userId
        })

        return {
            message : PublicMessage.Created
        }
    }

    async findAll(){
        const userId = this.req.user.id
        const image = await this.imagesRepository.find({
            where : { userId },
            order : { id : 'DESC' },
        })

        if (!image) throw new NotFoundException(NotFoundMessage.NotFound)

        return image
    }

    async find(id : number){
        const userId = this.req.user.id
        return this.imagesRepository.findOne({
            where : { userId, id },
            order : { id : 'DESC' },
        })
    }

    async remove(id : number){
        const image = await this.find(id)
        await this.imagesRepository.remove(image)
        return {
            message : PublicMessage.Deleted
        }
    }

}