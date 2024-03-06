import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import {AwsModule} from "../aws/aws.module";
import {AwsService} from "../aws/aws.service";

@Module({
  controllers: [FilesController],
  providers: [FilesService, AwsService],
  imports: [
    AwsModule,
  ]
})
export class FilesModule {}
