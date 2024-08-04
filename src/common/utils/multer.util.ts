import { Request } from "express";
import { mkdirSync } from "fs";
import { extname, join } from "path";
import { ValidationMessage } from "../types/enums/message.enum";

export type CallbackDestination = (error : Error, destination : string) => void
export type CallbackFileName = (error : Error, fileName : string) => void
export type MulterFile = Express.Multer.File

export const multerDestination = (filedName : string) => {
    return (req: Request, file : MulterFile, callback : CallbackDestination) : void => {
        let path = join("public","uploads", filedName)
        mkdirSync(path, {recursive : true})
        callback(null, path)
    }
}

export const multerFileName = (req: Request, file : MulterFile, callback : CallbackFileName) : void => {
        const ext = extname(file.originalname).toLowerCase()
        if (isValidFormat(ext)) {
            const fileName = `${Date.now()}${ext}`
            callback(null, fileName)
        } else {
            callback(new Error(ValidationMessage.InvalidImageFormat) ,null)
        }
}

const isValidFormat = (ext : string) => [".png", ".jpg", ".jpeg"].includes(ext)