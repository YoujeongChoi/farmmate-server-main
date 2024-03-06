import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Express } from 'express';
import {AwsService} from "../aws/aws.service";

@Controller('api/files')
export class FilesController {
  constructor(
      private readonly filesService: FilesService,
      private readonly awsService: AwsService
  ) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('파일을 선택해주세요.');
    }

    // 파일 확장자 추출
    const ext = file.originalname.split('.').pop() || 'png'; // 'png'는 기본값입니다. 필요에 따라 변경하세요.

    // 파일 이름에 확장자가 없으면 오류를 반환
    if (!ext) {
      throw new BadRequestException('파일 확장자를 확인할 수 없습니다.');
    }

    // AWS Service를 사용하여 파일을 S3에 업로드하고, 업로드된 파일의 URL을 반환합니다.
    const uploadedImageUrl = await this.awsService.imageUploadToS3(`${Date.now()}.${ext}`, file, ext);

    return { url: uploadedImageUrl }; // 클라이언트에게 URL을 반환합니다.
  }
}
