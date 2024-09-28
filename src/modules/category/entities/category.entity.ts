import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityNames } from "src/common/types/enums/entity.enum";
import { Column, Entity, OneToMany } from "typeorm";
import { BlogCategoryEntity } from "../../blog/entity/blog-category.entity";

@Entity(EntityNames.Category)
export class CategoryEntity extends BaseEntity{
    @Column()
    title : string
    
    @Column({nullable : true})
    priority : number

    @OneToMany(() => BlogCategoryEntity, blog => blog.category)
    blogCategory : [];

}
