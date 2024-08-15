import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityNames } from "src/common/types/enums/entity.enum";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { OtpEntity } from "./otp.entity";
import { ProfileEntity } from "./profile.entity";
import { BlogEntity } from "src/modules/blog/entity/blog.entity";
import { BlogLikeEntity } from "src/modules/blog/entity/like.entity";
import { BlogBookMarkEntity } from "src/modules/blog/entity/book-mark.entity";
import { BlogCommentEntity } from "src/modules/blog/entity/comment.entity";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
    @Column({unique : true, nullable : true})
    username : string

    @Column({unique : true, nullable : true})
    newUsername : string

    @Column({unique : true})
    phone : string

    @Column({unique : true, nullable : true})
    newPhone : string

    @Column({nullable : true, default : false})
    verifyPhone : boolean

    @Column({nullable : true})
    password : string

    @Column({unique : true, nullable : true})
    email : string

    @Column({unique : true, nullable : true})
    newEmail : string

    @Column({nullable : true, default : false})
    verifyEmail : boolean

    @UpdateDateColumn()
    updated_at : Date

    @Column({nullable : true}) 
    otpId : number

    @OneToOne(() => OtpEntity, otp => otp.user, {nullable : true})
    @JoinColumn({name : 'otpId'})
    otp : OtpEntity

    @Column({nullable : true})
    profileId : number

    @OneToOne(() => ProfileEntity, profile => profile.user, {nullable : true})
    @JoinColumn({name : "profileId"})
    profile : ProfileEntity

    @OneToMany(() => BlogEntity, blog => blog.author)
    blogs : BlogEntity[]

    @OneToMany(() => BlogLikeEntity, like => like.user)
    blogLikes : BlogLikeEntity[]

    @OneToMany(() => BlogBookMarkEntity, blog => blog.user)
    blogBookMark : BlogBookMarkEntity[]

    @OneToMany(() => BlogCommentEntity, comment => comment.user)
    blogComments : BlogCommentEntity[]
}