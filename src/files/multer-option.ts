import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import multer from 'multer';
import { imageMimeTypes, mediaMimeTypes, MulterBuilder } from './files.builder';

export const fileFilter = (kind: 'image' | 'media') => (req: any, file: any, cb: any) => {
    const types = kind === 'image' ? imageMimeTypes : mediaMimeTypes;
    const mimeType = types.find((im) => im === file.mimetype);
    if (!mimeType) {
        cb(new BadRequestException(`${types.join(', ')}만 저장할 수 있습니다.`), false);
    }

    if (kind === 'media') {
        file.originalname = `${new Date().getTime()}`;
    }

    return cb(null, true);
};

export const CreateProfileImageMulterOptions = (configService: ConfigService): multer.Options => {
    return {
        fileFilter: fileFilter('image'),
        storage: new MulterBuilder(configService)
            .allowImageMimeTypes()
            .setResource('user')
            .setPath('profile')
            .build(),
        limits: { fileSize: 1024 * 1024 * 20 }, // 20MB
    };
};


export const CreateBodyImageMulterOptions = (configService: ConfigService): multer.Options => {
    return {
        fileFilter: fileFilter('image'),
        storage: new MulterBuilder(configService) // ConfigService 인스턴스를 MulterBuilder에 전달
            .allowImageMimeTypes()
            .setResource('article') // 'user' 대신 'article'로 설정
            .setPath('body-image') // 이미지를 저장할 경로 설정
            .build(),
        limits: { fileSize: 1024 * 1024 * 20 }, // 파일 크기 제한 설정, 여기서는 20MB로 설정
    };
};
