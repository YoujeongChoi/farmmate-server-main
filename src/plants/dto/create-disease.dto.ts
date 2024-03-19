import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateDiseaseDto {
    @ApiProperty({ description: '질병명' })
    @IsOptional()
    @IsString()
    readonly diseaseName: string;

    @ApiProperty({ description: '식물 이름' })
    @IsOptional()
    @IsString()
    readonly plantName: string;

    @ApiProperty({ description: '질병 코드' })
    @IsOptional()
    @IsNumber()
    readonly diseaseCode: number;

    @ApiProperty({ description: '질병 증상' })
    @IsOptional()
    @IsString()
    readonly diseaseSymptom?: string;

    @ApiProperty({ description: '질병 원인' })
    @IsOptional()
    @IsString()
    readonly diseaseCause?: string;

    @ApiProperty({ description: '치료법' })
    @IsOptional()
    @IsString()
    readonly diseaseTreatment?: string;

    @ApiProperty({ description: '질병 이미지 URL', required: false })
    @IsOptional()
    @IsString()
    readonly plantImg?: string;
}
