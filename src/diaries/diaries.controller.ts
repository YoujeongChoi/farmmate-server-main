import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile, Query, Put
} from '@nestjs/common';
import { DiariesService } from './diaries.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/diary')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  // 다이어리 등록
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
      // @Param('plantUuid') plantUuid: string,
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

    return this.diariesService.create(createDiaryDto, file);
  }

  // 개별 다이어리 조회
  @Get('/:diaryUuid')
  findOne(
      @Param('plantUuid') plantUuid: string
  ) {
    return this.diariesService.findOne(plantUuid);
  }

  // 다이어리 리스트 조회 (날짜, 식물별 조회)
  @Get()
  findAll(
      @Query('date') date: string,
      @Query('plant') plant: string
  ) {
    return this.diariesService.findAll(date, plant);
  }

  // 다이어리 수정
  @Put('/:diaryUuid')
  @UseInterceptors(FileInterceptor('image'))
  update(
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

    return this.diariesService.update(diaryUuid, updateDiaryDto, file);
  }


  @Delete(':diaryUuid')
  remove(@Param('diaryUuid') diaryUuid: string) {
    return this.diariesService.remove(diaryUuid);
  }
}
