import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityNames } from "src/common/types/enums/entity.enum";
import { Column, Entity, OneToOne } from "typeorm";
import { Gender } from "../enum/gender.enum";
import { UserEntity } from "./user.entity";

@Entity(EntityNames.Profile)
export class ProfileEntity extends BaseEntity {
   
   @Column()
   userId : number

   @OneToOne(() => UserEntity, user => user.profile, {onDelete : 'CASCADE'})
   user : UserEntity

   @Column()
   nick_name : string
   
   @Column({nullable : true})
   bio : string
   
   @Column({nullable : true})
   bg_image : string
   
   @Column({nullable : true})
   profile_image : string
   
   @Column({nullable : true})
   gender : string

   @Column({nullable : true,})
   birthday : Date

   @Column({nullable : true})
   linkedin_profile : string

   @Column({nullable : true})
   x_profile : string
}