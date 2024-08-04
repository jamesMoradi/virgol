import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityNames } from "src/common/types/enums/entity.enum";
import { Column, Entity } from "typeorm";

@Entity(EntityNames.Category)
export class CategoryEntity extends BaseEntity{
    @Column()
    title : string
    
    @Column({nullable : true})
    priority : number

    // @Column()


    // @Column()

}
