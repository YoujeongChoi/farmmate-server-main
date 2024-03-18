import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  BadRequestException, UploadedFile, Logger, Res, NotFoundException
} from '@nestjs/common';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Plant } from "./entities/plant.entity";
import {FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express";
import {AwsService} from "../aws/aws.service";
import {DiagnosePlantDto} from "./dto/diagnose-plant.dto";
import axios from "axios";
import { Express } from 'express';
import * as FormData from 'form-data';
import { Response } from "express"
import {ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam} from '@nestjs/swagger'
import {UpdateDiaryDto} from "../diaries/dto/update-diary.dto";
import {CreateDiaryDto} from "../diaries/dto/create-diary.dto";
import {CreateBookmarkDto} from "./dto/create-bookmark.dto";
import {DiagnoseResultDto} from "./dto/diagnose-result.dto";

@Controller('api/plant')
export class PlantsController {
  constructor(
      private readonly plantsService: PlantsService,
      private readonly awsService: AwsService
  ) {}

  // 특정 디바이스가 생성한 식물 리스트 조회
  @Get('/device/:deviceId')
  @ApiOperation({ summary: '디바이스 식물 리스트 조회', description: '디바이스별 생성된 식물 리스트를 조회합니다.' })
  @ApiParam({
    name: 'deviceId',
    type: 'uuid',
    description: '조회할 디바이스 uuid',
  })
  @ApiResponse({ status: 200, description: '디바이스 식물 리스트 조회에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '디바이스 식물 리스식ㅁ 조회에 실패하였습니다' })
  async getAllByDeviceId(@Param('deviceId') deviceId: string): Promise<Plant[]> {
    return this.plantsService.getAllByDeviceId(deviceId);
  }

  // 개별 식물 조회
  @Get('/:plantUuid')
  @ApiOperation({ summary: '식물 조회', description: '개별 식물 정보를 조회합니다.' })
  @ApiParam({
    name: 'plantUuid',
    type: 'uuid',
    description: '조회할 식물 uuid',
  })
  @ApiResponse({ status: 200, description: '식물 조회에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '식물 조회에 실패하였습니다' })
  async findOne(@Param('plantUuid') plantUuid: string): Promise<any> {
    return this.plantsService.getOne(plantUuid);
  }

  @Post()
  @ApiOperation({ summary: '식물 등록', description: '식물 정보를 추가합니다.' })
  @ApiBody({ type: CreatePlantDto })
  @ApiResponse({ status: 200, description: '식물 등록에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '식물 등록에 실패하였습니다' })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'plantImg', maxCount: 1 }
  ]))
  async create(
      @Body() createPlantDto: CreatePlantDto,
      @UploadedFiles() files: { plantImg?: Express.Multer.File[] }
  ): Promise<Plant[]> {
    const imageFile = files.plantImg?.[0]; // 이미지 파일
    let imageUrl;

    if (imageFile) {
      imageUrl = await this.awsService.imageUploadToS3(`plants/${Date.now()}_${imageFile.originalname}`, imageFile, imageFile.mimetype.split('/')[1]);
    } else {
      imageUrl = null
    }

    return this.plantsService.create({
      ...createPlantDto,
      imageUrl
    });
  }

  // 식물 삭제
  @Delete("/:plantUuid")
  @ApiOperation({ summary: '식물 삭제', description: '식물을 삭제합니다.' })
  @ApiParam({
    name: 'plantUuid',
    type: 'uuid',
    description: '삭제할 식물 uuid',
  })
  @ApiResponse({ status: 200, description: '식물 삭제에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '식물 삭제에 실패하였습니다' })
  async remove(@Param("plantUuid") plant_uuid: string): Promise<void> {
    return this.plantsService.deleteOne(plant_uuid);
  }

  // 식물 수정
  @Put('/:plantUuid')
  @ApiOperation({ summary: '식물 수정', description: '식물 내용을 수정합니다.' })
  @ApiBody({ type: UpdatePlantDto })
  @ApiResponse({ status: 200, description: '식물 수정에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '식물 수정에 실패하였습니다' })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'plantImg', maxCount: 1 },
  ]))
  async update(
      @Param('plantUuid') plantUuid: string,
      @Body() updatePlantDto: UpdatePlantDto,
      @UploadedFiles() files: { plantImg?: Express.Multer.File[] }
  ): Promise<Plant[]> {
    const imageFile = files?.plantImg?.[0] ;
    let imageUrl;
    let updatedData;

    if (imageFile) {
      imageUrl = await this.awsService.imageUploadToS3(`plants/${Date.now()}_${imageFile.originalname}`, imageFile, imageFile.mimetype.split('/')[1]);
      updatedData = { ...updatePlantDto, imageUrl };
    } else {
      updatedData = { ...updatePlantDto };
    }

    return this.plantsService.update(plantUuid, updatedData);
  }

  // 북마크 등록
  @Post("/:plantUuid/bookmark")
  @ApiOperation({ summary: '북마크 등록', description: '북마크를 등록합니다.' })
  @ApiParam({
    name: 'plantUuid',
    type: 'uuid',
    description: '북마크에 등록할 식물 uuid',
  })
  @ApiResponse({ status: 200, description: '북마크 등록에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '북마크 등록에 실패하였습니다' })
  async bookmark(@Param('plantUuid') plantUuid: string, @Res() response: Response): Promise<Response> {
    const result = await this.plantsService.bookmark(plantUuid);
    if (result === '북마크가 등록되었습니다.') {
      return response.status(201).json({ code: 201,  message: "bookmark" });
    } else if (result === '북마크가 다시 등록되었습니다.') {
      return response.status(201).json({ code: 201, message: "bookmark" }); // 재등록도 등록으로 간주
    } else {
      return response.status(202).json({ code: 202, message: "cancelled" });
    }
  }

  // 북마크 리스트 조회
  @Get('/device/:deviceId/bookmark')
  @ApiOperation({ summary: '디바이스 북마크 리스트 조회', description: '디바이스별 등록한 북마크 리스트를 조회합니다.' })
  @ApiParam({
    name: 'deviceId',
    type: 'uuid',
    description: '북마크 리스트 조회할 디바이스 uuid',
  })
  @ApiResponse({ status: 200, description: '북마크 리스트 조회에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '북마크 리스 조회에 실패하였습니다' })
  async getAllBookmarksByDeviceId(@Param('deviceId') deviceId: string): Promise<Plant[]> {
    return this.plantsService.findAllBookmarksByDeviceId(deviceId);
  }

  /*
  * 진단
  * */
  // In your PlantsController
  private readonly logger = new Logger(PlantsController.name);

  @Post('/diagnose')
  @ApiOperation({ summary: '작물 병 진단 요청', description: '병 진단을 요청합니다.' })
  @ApiBody({ type: DiagnosePlantDto })
  @ApiResponse({ status: 200, description: '진단 요청에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '진단 요청에 실패하였습니다' })
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new BadRequestException('Unsupported file type'), false);
      }
      callback(null, true);
    },
  }))
  async diagnosePlant(
      @Body() diagnosePlantDto: DiagnosePlantDto,
      @UploadedFile() image: Express.Multer.File,
  ): Promise<any> {
    this.logger.log('Received a request for /diagnose');
    if (!image) {
      throw new BadRequestException('Image file is required');
    }

    const formData = new FormData();
    formData.append('plantType', diagnosePlantDto.plantType);
    formData.append('image', image.buffer, image.originalname);

    try {
      this.logger.debug(`Sending request to Flask with plantType: ${diagnosePlantDto.plantType} and image: ${image.originalname}`);
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });


      const disease = await this.plantsService.findByPlantTypeAndDiagnosisCode(
          diagnosePlantDto.plantType,
          response.data.predictedClass
      );

      return disease;
    } catch (error) {
      this.logger.error('Failed to diagnose plant', error.message);
      throw new BadRequestException('Failed to diagnose plant');
    }
  }

  @Post('/diagnose/result')
  @ApiOperation({ summary: '진단 결과 저장', description: '진단 결과를 저장합니다.' })
  @ApiBody({ type: DiagnoseResultDto })
  @ApiResponse({ status: 201, description: '진단 결과 저장에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '진단 결과 저장에 실패하였습니다' })
  async saveDiagnoseResult(@Body() diagnoseResultDto: DiagnoseResultDto): Promise<any> {
    return this.plantsService.saveDiagnoseResult(diagnoseResultDto);
  }


  @Get('/diagnose/result/:plantDiseaseUuid')
  @ApiOperation({ summary: '진단 결과 조회', description: '특정 진단 결과와 관련된 식물 및 질병 정보를 조회합니다.' })
  @ApiParam({
    name: 'plantDiseaseUuid',
    type: 'string',
    description: '조회할 진단 결과의 UUID',
  })
  @ApiResponse({ status: 200, description: '진단 결과 조회에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '진단 결과 조회에 실패하였습니다' })
  async getDiagnoseResult(@Param('plantDiseaseUuid') plantDiseaseUuid: string): Promise<any> {
    return this.plantsService.getDiagnoseResult(plantDiseaseUuid);
  }

  @Get('/diagnose/result/:plantUuid')
  @ApiOperation({ summary: '식물 진단 결과 리스트 조회', description: '특정 식물에 대한 모든 진단 결과를 조회합니다.' })
  @ApiParam({
    name: 'plantUuid',
    type: 'string',
    description: '조회할 식물의 UUID',
  })
  @ApiResponse({ status: 200, description: '식물 진단 결과 리스트 조회에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '식물 진단 결과 리스트 조회에 실패하였습니다' })
  async getAllDiagnoseResultsByPlant(@Param('plantUuid') plantUuid: string): Promise<any> {
    return this.plantsService.getAllDiagnoseResultsByPlant(plantUuid);
  }
}

