import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
export declare class DevicesController {
    private readonly deviceService;
    constructor(deviceService: DevicesService);
    create(createDeviceDto: CreateDeviceDto): Promise<import("./entities/device.entity").Device>;
    delete(deviceId: string): Promise<void>;
}
