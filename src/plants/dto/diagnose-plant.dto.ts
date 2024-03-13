import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class DiagnosePlantDto {

    @ApiProperty({ description: '식물 종류' })
    @IsString()
    @IsNotEmpty()
    readonly plantType: string;

    @ApiProperty({ description: '이미지' })
    @IsOptional()
    readonly image: string | null;

}
