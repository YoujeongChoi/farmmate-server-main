import { Injectable } from '@nestjs/common';
import {MulterModuleOptions, MulterOptionsFactory} from "@nestjs/platform-express";


@Injectable()
export class FilesService implements MulterOptionsFactory {

  createMulterOptions(): MulterModuleOptions {
    return {
      dest: './upload',
    };
  }

}
