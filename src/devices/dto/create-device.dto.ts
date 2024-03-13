import { IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateDeviceDto {
    @ApiProperty({ description: '디바이스 id(PK)' })
    @IsString()
    readonly deviceId: string;
}
