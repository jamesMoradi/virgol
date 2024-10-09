import { EntityNames } from "src/common/types/enums/entity.enum";
import { Column, Entity, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { BaseEntity } from "src/common/abstract/base.entity";

@Entity(EntityNames.Follow)
export class FollowEntity extends BaseEntity {

    @Column()
    followingId : number

    @Column()
    followerId : number

    @ManyToOne(() => UserEntity, user => user.following, {onDelete : "CASCADE"})
    following : UserEntity

    @ManyToOne(() => UserEntity, user => user.followers, {onDelete : "CASCADE"})
    followers : UserEntity
}