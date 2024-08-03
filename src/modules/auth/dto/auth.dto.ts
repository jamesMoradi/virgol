import { ApiProperty } from "@nestjs/swagger"
import { AuthType } from "../enums/type.enum"
import { IsEnum, IsString, Length } from "class-validator"
import { AuthMethod } from "../enums/method.enum"

export class AuthDto {
    @ApiProperty()
    @IsString()
    @Length(3, 100)
    username : string

    @ApiProperty({enum : AuthType})
    @IsEnum(AuthType)
    type : string

    @ApiProperty({enum : AuthMethod})
    @IsEnum(AuthMethod)
    @ApiProperty()
    method : AuthMethod
}

export class CheckOtp {
    @ApiProperty()
    @IsString()
    @Length(5,5)
    code : string
}