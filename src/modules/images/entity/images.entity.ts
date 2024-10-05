import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityNames } from "src/common/types/enums/entity.enum";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity(EntityNames.Images)
export class ImagesEntity extends BaseEntity{
    @Column()
    name : string

    @Column()
    location : string

    @Column()
    alt : string

    @Column()
    userId : number

    @ManyToOne(() => UserEntity, user => user.images, {onDelete : 'CASCADE'})
    user : UserEntity
}