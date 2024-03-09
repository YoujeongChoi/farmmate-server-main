import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile, Query
} from '@nestjs/common';
import { DiariesService } from './diaries.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/diary')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
      @Param('plantUuid') plantUuid: string,
      @Body() rawBody: any,
      @UploadedFile() file: Express.Multer.File
  ) {
    const { waterFlag, fertilizerFlag, pesticideFlag, ...otherFields } = rawBody;

    const createDiaryDto: CreateDiaryDto = {
      ...otherFields,
      waterFlag: waterFlag === 'true' ? true : false,
      fertilizerFlag: fertilizerFlag === 'true' ? true : false,
      pesticideFlag: pesticideFlag === 'true' ? true : false,
    };

    return this.diariesService.create(plantUuid, createDiaryDto, file);
  }

  @Get(':diaryUuid')
  findOne(
      @Param('plantUuid') plantUuid: string,
      @Param('diaryUuid') diaryUuid: string
  ) {
    return this.diariesService.findOne(plantUuid, diaryUuid);
  }

  @Get()
  findAll(
      @Query('date') date: string,
      @Query('plant') plant: string
  ) {
    return this.diariesService.findAll(date, plant);
  }
  @Patch(':diaryUuid')
  @UseInterceptors(FileInterceptor('image'))
  update(
      @Param('plantUuid') plantUuid: string,
      @Param('diaryUuid') diaryUuid: string,
      @Body() rawBody: any,
      @UploadedFile() file: Express.Multer.File
  ) {

    const { waterFlag, fertilizerFlag, pesticideFlag, ...otherFields } = rawBody;

    const updateDiaryDto: UpdateDiaryDto = {
      ...otherFields,
      waterFlag: waterFlag === 'true',
      fertilizerFlag: fertilizerFlag === 'true',
      pesticideFlag: pesticideFlag === 'true'
    };

    return this.diariesService.update(plantUuid, diaryUuid, updateDiaryDto, file);
  }


  @Delete(':diaryUuid')
  remove(@Param('plantUuid') plantUuid: string, @Param('diaryUuid') diaryUuid: string) {
    return this.diariesService.remove(plantUuid, diaryUuid);
  }
}
