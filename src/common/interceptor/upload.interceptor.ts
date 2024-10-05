import { FileInterceptor } from "@nestjs/platform-express"
import { multerDestination, multerStorage } from "../utils/multer.util"

export const UploadFile = (fieldName : string, fileName : string = 'images') =>{
    return class UploadUtility extends FileInterceptor(fieldName, {
        storage : multerStorage(fileName)
    }){}
}