import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityNames } from "src/common/types/enums/entity.enum";
import { Column, Entity, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(EntityNames.Otp)
export class OtpEntity extends BaseEntity {
    @Column()
    code : string

    @Column({nullable : true})
    method : string


    @Column()
    expiresIn : Date

    @Column()
    userId : number

    @OneToOne(() => UserEntity, user => user.otp, {onDelete : 'CASCADE'})
    user : UserEntity 
}
