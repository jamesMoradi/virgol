import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

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
}

export class FilterBlogDto {
    search : string
}