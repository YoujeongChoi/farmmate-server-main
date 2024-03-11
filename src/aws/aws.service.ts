import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_BUCKET_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials are not provided');
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async imageUploadToS3(
      fileName: string | null,
      file: Express.Multer.File,
      ext: string | null,
  ) {
    const bucketName = this.configService.get<string>('AWS_BUCKET_NAME');
    if (!bucketName) {
      throw new Error('AWS S3 bucket name is not provided in the environment variables');
    }


    const safeFileName = fileName ?? `default_${Date.now()}`;
    const safeExt = ext ?? 'jpg';

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: safeFileName,
      Body: file.buffer,
      ContentType: `image/${safeExt}`,
    });

    await this.s3Client.send(command);
    return `https://${bucketName}.s3.${this.configService.get<string>('AWS_BUCKET_REGION')}.amazonaws.com/${safeFileName}`;
  }


}