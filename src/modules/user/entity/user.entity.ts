import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityNames } from "src/common/types/enums/entity.enum";
import { Column, Entity, UpdateDateColumn } from "typeorm";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
    @Column({unique : true})
    username : string

    @Column({unique : true})
    phone : string

    @Column()
    password : string

    @Column({unique : true})
    email : string

    @UpdateDateColumn()
    updated_at : Date
    
}