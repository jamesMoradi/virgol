import { Module } from "@nestjs/common";
import { ImagesController } from "./images.controller";
import { ImagesService } from "./images.service";
import { TypeOrmConfig } from "src/config/typeorm.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImagesEntity } from "./entity/images.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports : [
        AuthModule,
        TypeOrmModule.forFeature([ImagesEntity])
    ],
    controllers : [ImagesController],
    providers : [ImagesService] 
})
export class ImagesModule {}