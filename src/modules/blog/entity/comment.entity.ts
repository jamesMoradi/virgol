import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityNames } from "src/common/types/enums/entity.enum";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";

@Entity(EntityNames.BlogComments)
export class BlogCommentEntity extends BaseEntity {
    @Column()
    text : string

    @Column({default : false})
    accepted : boolean

    @Column()
    blogId : number
    
    @ManyToOne(() => BlogEntity, blog => blog.comments, {onDelete : 'CASCADE'})
    blog : BlogEntity

    @Column()
    userIdId : number

    @ManyToOne(() => UserEntity, user => user.blogComments, {onDelete : 'CASCADE'})
    user : UserEntity

    @Column()
    parentId : number

    @ManyToOne(() => BlogCommentEntity, comment => comment.children, {onDelete : 'CASCADE'})
    parent : BlogCommentEntity    
    
    @OneToMany(() => BlogCommentEntity, comment => comment.parent)
    @JoinColumn({name : 'parent'})
    children : BlogCommentEntity[]
}
