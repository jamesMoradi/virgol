import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { diskStorage } from "multer"
import { multerDestination, multerFileName, multerStorage } from "src/common/utils/multer.util"

export const multerConfig = () => {
    return FileFieldsInterceptor([
        {name : "bg_image", maxCount : 1},
        {name : "profile_image", maxCount : 1},
      ], {
        storage : multerStorage('user-profile')
    })
}