import { BaseEntity, Entity } from "typeorm";
import { EntityNames } from "src/common/types/enums/entity.enum";

@Entity(EntityNames.BlogCategorys)
export class BlogCategoryEntity extends BaseEntity {
    
}