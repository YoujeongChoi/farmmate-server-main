import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private s3Client: S3Client;  // 프로퍼티 이름을 s3Client로 변경

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_BUCKET_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials are not provided');
    }

    this.s3Client = new S3Client({  // this.s3Client로 변경
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async imageUploadToS3(
      fileName: string,
      file: Express.Multer.File,
      ext: string,
  ) {
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'), // S3 버킷 이름을 가져옵니다.
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: `image/${ext}`,
    });

    await this.s3Client.send(command); // this.s3Client를 사용하여 명령을 보냅니다.

    return `https://${this.configService.get<string>('AWS_S3_BUCKET_NAME')}.s3.${this.configService.get<string>('AWS_BUCKET_REGION')}.amazonaws.com/${fileName}`;
  }
}