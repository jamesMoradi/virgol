import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityNames } from "src/common/types/enums/entity.enum";
import { Column, Entity, JoinColumn, OneToOne, UpdateDateColumn } from "typeorm";
import { OtpEntity } from "./otp.entity";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
    @Column({unique : true, nullable : true})
    username : string

    @Column({unique : true})
    phone : string

    @Column({nullable : true})
    password : string

    @Column({unique : true, nullable : true})
    email : string

    @UpdateDateColumn()
    updated_at : Date

    @Column({nullable : true}) 
    otpId : number

    @OneToOne(() => OtpEntity, otp => otp.user, {nullable : true})
    @JoinColumn({name : 'otpId'})
    otp : OtpEntity
    
}