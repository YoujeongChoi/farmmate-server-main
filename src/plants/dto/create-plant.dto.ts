import {IsDateString, IsOptional, IsString, IsUUID} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePlantDto {
    @ApiProperty({ description: '디바이스 id(FK)' })
    @IsString()
    @IsOptional()
    readonly deviceId: string ;

    @ApiProperty({ description: '식물 종류' })
    @IsString()
    @IsOptional()
    readonly plantType: string | null;

    @ApiProperty({ description: '식물 이름' })
    @IsString()
    @IsOptional()
    readonly plantName: string | null;

    @ApiProperty({ description: '식물 위치' })
    @IsString()
    @IsOptional()
    readonly plantLocation: string | null;

    @ApiProperty({ description: '메모' })
    @IsString()
    @IsOptional()
    readonly memo: string | null;

    @ApiProperty({ description: '처음 식물 심은 날짜 (Date 타입)' })
    @IsDateString()
    @IsOptional()
    readonly firstPlantingDate: string | null;

    @ApiProperty({ description: '이미지' })
    @IsString()
    @IsOptional()
    readonly imageUrl: string | null;
}
