import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from 'class-validator';

export class DiagnoseResultDto {
    @ApiProperty({ description: '식물 UUID' })
    @IsString()
    @IsNotEmpty()
    readonly plantUuid: string;

    @ApiProperty({ description: '질병 UUID' })
    @IsString()
    @IsNotEmpty()
    readonly diseaseUuid: string;
}
