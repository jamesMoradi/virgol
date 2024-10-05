import { ApiProperty } from "@nestjs/swagger";

export class ImagesDto {
    @ApiProperty({format : 'binary'})
    image : string

    @ApiProperty({format : 'binary'})
    alt : string

    @ApiProperty({format : 'binary'})
    location : string
}