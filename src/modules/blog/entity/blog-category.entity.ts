import { BaseEntity, Column, Entity, ManyToOne } from "typeorm";
import { EntityNames } from "src/common/types/enums/entity.enum";
import { BlogEntity } from "./blog.entity";
import { CategoryEntity } from "../../category/entities/category.entity";

@Entity(EntityNames.BlogCategorys)
export class BlogCategoryEntity extends BaseEntity {
    @Column()
    blogId : number;

    @Column()
    categoryId : number;

    @ManyToOne(() => BlogEntity,  blog => blog.categories, {onDelete : 'CASCADE'})
    blog : BlogEntity;

    @ManyToOne(() => CategoryEntity, category => category.blogCategory, {onDelete : 'CASCADE'})
    category : CategoryEntity
}