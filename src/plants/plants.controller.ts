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
  BadRequestException
} from '@nestjs/common';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Plant } from "./entities/plant.entity";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {AwsService} from "../aws/aws.service";

@Controller('api/plant')
export class PlantsController {
  constructor(
      private readonly plantsService: PlantsService,
      private readonly awsService: AwsService
  ) {}

  @Get()
  async getAll(): Promise<Plant[]> {
    return this.plantsService.getAll();
  }

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

}
