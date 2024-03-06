import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';
export declare class DevicesService {
    private deviceRepository;
    constructor(deviceRepository: Repository<Device>);
    create(createDeviceDto: CreateDeviceDto): Promise<Device>;
    delete(deviceId: string): Promise<void>;
}
