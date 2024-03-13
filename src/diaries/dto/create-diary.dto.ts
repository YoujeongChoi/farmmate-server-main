import {IsBoolean, IsDateString, IsOptional, IsString, IsUUID} from "class-validator";

export class CreateDiaryDto {
    @IsString()
    @IsOptional()
    readonly plantUuid: string;

    @IsDateString()
    @IsString()
    @IsOptional()
    readonly diaryDate: string;

    @IsString()
    @IsOptional()
    readonly plantWeather: string;

    @IsString()
    @IsOptional()
    readonly temperature: string;

    @IsString()
    @IsOptional()
    readonly humidity: string;

    @IsBoolean()
    @IsOptional()
    waterFlag: boolean;

    @IsBoolean()
    @IsOptional()
    fertilizerFlag: boolean;

    @IsString()
    @IsOptional()
    readonly fertilizerName: string;

    @IsString()
    @IsOptional()
    readonly fertilizerUsage: string;

    @IsBoolean()
    @IsOptional()
    pesticideFlag: boolean;

    @IsString()
    @IsOptional()
    readonly pesticideName: string;

    @IsString()
    @IsOptional()
    readonly pesticideUsage: string;

    @IsString()
    @IsOptional()
    readonly memo: string;

}
