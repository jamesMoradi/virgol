import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateBlogDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(10,150)
    title : string

    @ApiProperty({format : 'binary'})
    image : string

    @ApiProperty()
    @IsNotEmpty()
    @Length(10,300)
    description : string

    @ApiProperty()
    @IsNotEmpty()
    content : string

    @ApiPropertyOptional()
    slug : string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    timeForStudy : number

    @ApiProperty({type : String, isArray : true})
    @IsArray()
    categories : string[] | String
}

export class FilterBlogDto {
    category : string
    search : string
}

export class UpdateBlogDto extends PartialType(CreateBlogDto){}