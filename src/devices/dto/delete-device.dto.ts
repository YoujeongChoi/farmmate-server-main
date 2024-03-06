
import { IsUUID } from 'class-validator';

export class DeleteDeviceDto {
    @IsUUID()
    readonly deviceUuid: string;
}
