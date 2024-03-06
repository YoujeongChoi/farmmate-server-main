import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@Controller('api/device')
export class DevicesController {
  constructor(private readonly deviceService: DevicesService) {}

  @Post()
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.deviceService.create(createDeviceDto);
  }

  @Delete('/:deviceId') // deviceId를 URL 파라미터로 받음
  delete(@Param('deviceId') deviceId: string) {
    return this.deviceService.delete(deviceId);
  }
}
