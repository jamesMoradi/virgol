import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, isEnum, IsString, Length } from "class-validator"
import { Gender } from "../enum/gender.enum"

export class ProfileDto {
        
   @ApiPropertyOptional({nullable : true})
   @IsString()
   @Length(3,50)
   nick_name : string
    
   @ApiPropertyOptional({nullable : true})
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