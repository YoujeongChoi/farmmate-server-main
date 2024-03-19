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
import {ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam, ApiQuery} from '@nestjs/swagger'
import {CreatePlantDto} from "../plants/dto/create-plant.dto";


@Controller('api/diary')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  // 다이어리 등록
  @Post()
  @ApiOperation({ summary: '다이어리 등록', description: '다이어리를 추가합니다.' })
  @ApiBody({ type: CreateDiaryDto })
  @ApiResponse({ status: 200, description: '다이어리 등록에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '다이어리 등록에 실패하였습니다' })
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
  @ApiOperation({ summary: '다이어리 조회', description: '개별 다이어리를 조회합니다.' })
  @ApiParam({
    name: 'diaryUuid',
    type: 'uuid',
    description: '조회할 다이어리 uuid',
  })
  @ApiResponse({ status: 200, description: '다이어리 조회에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '다이어리 조회에 실패하였습니다' })
  findOne(
      @Param('diaryUuid') diaryUuid: string
  ) {
    return this.diariesService.findOne(diaryUuid);
  }

  // 다이어리 리스트 조회 (날짜, 식물별 조회)
  @Get()
  @ApiOperation({ summary: '다이어리 리스트 조회', description: '날짜별/식물별 다이어리를 조회합니다.' })
  @ApiQuery({
    name: 'date',
    required: false,
    description: '조회할 다이어리 날짜',
  })
  @ApiQuery({
    name: 'plant',
    required: false,
    description: '조회할 다이어리의 식물종류',
  })
  @ApiResponse({ status: 200, description: '다이어리 조회에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '다이어리 조회에 실패하였습니다' })
  findAll(
      @Query('date') date: string,
      @Query('plant') plant: string
  ) {
    return this.diariesService.findAll(date, plant);
  }

  // 다이어리 수정
  @Put('/:diaryUuid')
  @ApiOperation({ summary: '다이어리 수정', description: '다이어리 내용을 수정합니다.' })
  @ApiBody({ type: UpdateDiaryDto })
  @ApiResponse({ status: 200, description: '다이어리 수정에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '다이어리 수정에 실패하였습니다' })
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
  @ApiOperation({ summary: '다이어리 삭제', description: '다이어리를 삭제합니다.' })
  @ApiParam({
    name: 'diaryUuid',
    type: 'uuid',
    description: '삭제할 다이어리 uuid',
  })
  @ApiResponse({ status: 200, description: '다이어리 삭제에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '다이어리 삭제에 실패하였습니다' })
  remove(@Param('diaryUuid') diaryUuid: string) {
    return this.diariesService.remove(diaryUuid);
  }
}
