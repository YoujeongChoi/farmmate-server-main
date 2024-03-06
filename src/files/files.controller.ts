import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UploadedFile, ParseFilePipeBuilder, HttpStatus, BadRequestException
} from '@nestjs/common';
import { FilesService } from './files.service';
import {FileFieldsInterceptor, FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {Express} from "express";

@Controller('api/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // @Post('/upload')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  // }


  // @Post('/file')
  // uploadFileAndPassValidation(
  //     @Body() body: CreateFileDto,
  //     @UploadedFile(
  //         new ParseFilePipeBuilder()
  //             .addFileTypeValidator({
  //               fileType: 'jpeg',
  //             })
  //             .addMaxSizeValidator({
  //               maxSize: 1000
  //             })
  //             .build({
  //               errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
  //             }),
  //     )
  //         file: Express.Multer.File,
  // ) {
  //   return {
  //     body,
  //     file: file.buffer.toString(),
  //   };
  // }

  // s3
  @Post('/test/upload')
  async upload(@UploadedFiles() files: Express.MulterS3.File[]) {
    if (!files?.length) {
      // throw new BadRequestException(ERROR.SELECT_MORE_THAN_ONE_BODY_IMAGE);
    }
    return files.map(({ location }) => location);
  }
}
