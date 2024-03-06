import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Plant} from "../plants/entities/plant.entity";
import {Device} from "./entities/device.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
