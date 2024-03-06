import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Plant} from "./entities/plant.entity";
import {Device} from "../devices/entities/device.entity";
import {AwsService} from "../aws/aws.service";

@Module({
  imports: [TypeOrmModule.forFeature([Plant, Device])],
  controllers: [PlantsController],
  providers: [PlantsService, AwsService],
})
export class PlantsModule {}
