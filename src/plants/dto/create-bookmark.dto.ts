import { IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBookmarkDto {
    @ApiProperty({ description: '식물 uuid(FK)' })
    @IsString()
    readonly plantUuid: string;

    @ApiProperty({ description: '디바이스 id(FK)' })
    @IsString()
    readonly deviceId: string;
}