import { Module } from '@nestjs/common';
import { DiariesService } from './diaries.service';
import { DiariesController } from './diaries.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Plant} from "../plants/entities/plant.entity";
import {Device} from "../devices/entities/device.entity";
import {HttpModule} from "@nestjs/axios";
import {Diary} from "./entities/diary.entity";
import {AwsService} from "../aws/aws.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary, Plant]),
    HttpModule,
  ],
  controllers: [DiariesController],
  providers: [DiariesService, AwsService],
})
export class DiariesModule {}
