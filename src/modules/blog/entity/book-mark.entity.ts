import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityNames } from "src/common/types/enums/entity.enum";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";

@Entity(EntityNames.BlogBookMark)
export class BlogBookMarkEntity extends BaseEntity {
    @Column()
    blogId : number

    @Column()
    userId : number

    @ManyToOne(() => UserEntity, user => user.blogBookMark, {onDelete : "CASCADE"})
    user : UserEntity

    @ManyToOne(() => BlogEntity, blog => blog.bookmarks, {onDelete : 'CASCADE'})
    blog : BlogEntity
}