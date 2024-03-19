import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';

@Injectable()
export class DevicesService {
  constructor(
      @InjectRepository(Device)
      private deviceRepository: Repository<Device>,
  ) {}

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const newDevice = this.deviceRepository.create({
      device_id: createDeviceDto.deviceId
    });
    await this.deviceRepository.save(newDevice);
    return newDevice;
  }

  async delete(deviceId: string): Promise<void> {
    const result = await this.deviceRepository.softDelete({ device_id: deviceId });
    if (result.affected === 0) {
      throw new NotFoundException(`Device with ID "${deviceId}" not found`);
    }
  }

}
