import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEmail, IsEnum, isEnum, IsMobilePhone, IsOptional, IsString, Length } from "class-validator"
import { Gender } from "../enum/gender.enum"
import { ValidationMessage } from "src/common/types/enums/message.enum"

export class ProfileDto {    
   @ApiPropertyOptional({nullable : true})
   @IsString()
   @IsOptional()
   @Length(3,50)
   nick_name : string
    
   @ApiPropertyOptional({nullable : true})
   @IsOptional()
   @Length(10,200)
   bio : string
    
   @ApiPropertyOptional({nullable : true, format : "binary"})
   bg_image ?: string
    
   @ApiPropertyOptional({nullable : true, format : "binary"})
   profile_image ?: string
    
   @ApiPropertyOptional({nullable : true, enum : Gender})
   @IsEnum(Gender)
   gender : string 
    
   @ApiPropertyOptional({nullable : true, example : '1996-02-22T17:01:23.187Z'})
   birthday : Date
    
   @ApiPropertyOptional({nullable : true})
   linkedin_profile : string
    
   @ApiPropertyOptional({nullable : true})
   x_profile : string
}

export class ChangeEmailDto {
   @ApiProperty()
   @IsEmail({},{message : ValidationMessage.InvalidEmail})
   email : string
}

export class ChangePhoneDto {
   @ApiProperty()
   @IsMobilePhone('fa-IR', {}, {message : ValidationMessage.InvalidPhone})
   phone : string
}