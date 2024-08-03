import { UserEntity } from "src/modules/user/entity/user.entity";

declare global {
    namespace Express {
        interface Request {
            user? : UserEntity
        }
    }
}