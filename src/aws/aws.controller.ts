import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AwsService } from './aws.service';
import { CreateAwDto } from './dto/create-aw.dto';
import { UpdateAwDto } from './dto/update-aw.dto';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}


}
