import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  BadRequestException, UploadedFile, Logger, Res
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

@Controller('api/plant')
export class PlantsController {
  constructor(
      private readonly plantsService: PlantsService,
      private readonly awsService: AwsService
  ) {}

  // 식물
  @Get('/:plantUuid')
  async findOne(@Param('plantUuid') plantUuid: string): Promise<Plant> {
    return this.plantsService.getOne(plantUuid);
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'plantImg', maxCount: 1 }
  ]))
  async create(
      @Body() createPlantDto: CreatePlantDto,
      @UploadedFiles() files: { plantImg?: Express.Multer.File[] }
  ): Promise<Plant> {
    const imageFile = files.plantImg?.[0]; // 이미지 파일
    let imageUrl;

    if (imageFile) {
      // AWS Service를 사용하여 파일을 S3에 업로드하고, 업로드된 파일의 URL을 가져옵니다.
      imageUrl = await this.awsService.imageUploadToS3(`plants/${Date.now()}_${imageFile.originalname}`, imageFile, imageFile.mimetype.split('/')[1]);
    } else {
      imageUrl = null
    }

    // 식물 정보와 이미지 URL을 함께 저장
    return this.plantsService.create({
      ...createPlantDto,
      imageUrl

    });
  }

  @Post("/:plantUuid/bookmark")
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

  @Delete("/:plantUuid")
  async remove(@Param("plant_uuid") plant_uuid: string): Promise<void> {
    return this.plantsService.deleteOne(plant_uuid);
  }

  @Patch("/:plantUuid")
  async update(@Param("plant_uuid") plant_uuid: string, @Body() updateData: UpdatePlantDto): Promise<Plant> { // 메서드 파라미터 이름 변경
    return this.plantsService.update(plant_uuid, updateData);
  }

  @Get('/device/:deviceId')
  async getAllByDeviceId(@Param('deviceId') deviceId: string): Promise<Plant[]> {
    return this.plantsService.getAllByDeviceId(deviceId);
  }

  /*
  * 진단
  * */
  private readonly logger = new Logger(PlantsController.name);
  @Post('/diagnose')
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
      const response = await axios.post('http://127.0.0.1:5000/analyze', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });


      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to diagnose plant');
    }
  }
}
