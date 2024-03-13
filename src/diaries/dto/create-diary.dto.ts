import {IsBoolean, IsDateString, IsOptional, IsString, IsUUID} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDiaryDto {
    @ApiProperty({ description: '식물 uuid(FK)' })
    @IsString()
    @IsOptional()
    readonly plantUuid: string;

    @ApiProperty({ description: '다이어리 등록 날짜 (Date 타입)' })
    @IsDateString()
    @IsOptional()
    readonly diaryDate: string;

    @ApiProperty({ description: '날씨' })
    @IsString()
    @IsOptional()
    readonly plantWeather: string;

    @ApiProperty({ description: '기온' })
    @IsString()
    @IsOptional()
    readonly temperature: string;

    @ApiProperty({ description: '습도' })
    @IsString()
    @IsOptional()
    readonly humidity: string;

    @ApiProperty({ description: '물 줬는지 체크 (Boolean 타입)' })
    @IsBoolean()
    @IsOptional()
    waterFlag: boolean;

    @ApiProperty({ description: '비료 줬는지 체크 (Boolean 타입)' })
    @IsBoolean()
    @IsOptional()
    fertilizerFlag: boolean;

    @ApiProperty({ description: '비료 이름' })
    @IsString()
    @IsOptional()
    readonly fertilizerName: string;

    @ApiProperty({ description: '비료 사용량' })
    @IsString()
    @IsOptional()
    readonly fertilizerUsage: string;

    @ApiProperty({ description: '농약 줬는지 체크 (Boolean 타입)' })
    @IsBoolean()
    @IsOptional()
    pesticideFlag: boolean;

    @ApiProperty({ description: '비료 이름' })
    @IsString()
    @IsOptional()
    readonly pesticideName: string;

    @ApiProperty({ description: '비료 사용량' })
    @IsString()
    @IsOptional()
    readonly pesticideUsage: string;

    @ApiProperty({ description: '메모' })
    @IsString()
    @IsOptional()
    readonly memo: string;

    @ApiProperty({ description: '이미지' })
    @IsOptional()
    readonly image: string | null;

}
