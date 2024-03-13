// @ts-ignore
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // whiteList -> 엔티티 데코레이터에 없는 프로퍼티 값은 무조건 거름
  // forbidNonWhitelisted -> 엔티티 데코레이터에 없는 값 인입시 그 값에 대한 에러메세지 알려줌
  // transform -> 컨트롤러가 값을 받을때 컨트롤러에 정의한 타입으로 형변환
  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
  );
    const config = new DocumentBuilder()
        .setTitle('Farmmate API Documents')
        .setDescription('Farmmate API description')
        .setVersion('1.0')
        .addTag('farmmate')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
