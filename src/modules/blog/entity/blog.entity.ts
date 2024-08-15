import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityNames } from "src/common/types/enums/entity.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany } from "typeorm";
import { BlogStatus } from "../enums/status.enum";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { BlogLikeEntity } from "./like.entity";

@Entity(EntityNames.Blog)
export class BlogEntity extends BaseEntity {
    @Column()
    title : string

    @Column()
    description : string

    @Column()
    content : string

    @Column({nullable : true})
    image : string

    @Column()
    authorId : number

    @ManyToOne(() => UserEntity, user => user.blogs, {onDelete : 'CASCADE'})
    author : UserEntity

    @Column({default : BlogStatus.Draft})
    status : string

    @OneToMany(() => BlogLikeEntity, blogLike => blogLike.blog)
    blogLikes : BlogLikeEntity[]

    @CreateDateColumn()
    updatedAt : Date
}