import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diary } from './entities/diary.entity';
import { AwsService } from '../aws/aws.service';
import {Plant} from "../plants/entities/plant.entity";

@Injectable()
export class DiariesService {
  constructor(
      @InjectRepository(Diary) private readonly diaryRepository: Repository<Diary>,
      @InjectRepository(Plant) private readonly plantRepository: Repository<Plant>,
      private readonly awsService: AwsService,
  ) {}

  async create(plantUuid: string, createDiaryDto: CreateDiaryDto, file: Express.Multer.File) {
    const plant = await this.plantRepository.findOneBy({ plant_uuid: plantUuid });
    if (!plant) {
      throw new NotFoundException(`Plant with UUID ${plantUuid} not found`);
    }


    const fileName = file ? `${Date.now()}_${file.originalname}` : null;
    const ext = file ? file.mimetype.split('/')[1] : null;
    const imageUrl = file ? await this.awsService.imageUploadToS3(fileName, file, ext) : null;


    const diary = new Diary();

    diary.plant = plant;
    diary.image_url = imageUrl;
    diary.diary_date = createDiaryDto.diaryDate || null;
    diary.plant_weather = createDiaryDto.plantWeather || null;
    diary.temperature = createDiaryDto.temperature || null;
    diary.humidity = createDiaryDto.humidity ||  null;
    diary.water_flag = createDiaryDto.waterFlag !== undefined ? createDiaryDto.waterFlag : null;
    diary.fertilizer_flag = createDiaryDto.fertilizerFlag !== undefined ? createDiaryDto.fertilizerFlag : null;
    diary.fertilizer_name = createDiaryDto.fertilizerName || null;
    diary.fertilizer_usage = createDiaryDto.fertilizerUsage || null;
    diary.pesticide_flag = createDiaryDto.pesticideFlag !== undefined ? createDiaryDto.pesticideFlag : null;
    diary.pesticide_name = createDiaryDto.pesticideName || null;
    diary.pesticide_usage = createDiaryDto.pesticideUsage || null;
    diary.memo = createDiaryDto.memo || null;

    await this.diaryRepository.save(diary);

    return diary;
  }


  async update(plantUuid: string, diaryUuid: string, updateDiaryDto: UpdateDiaryDto, file: Express.Multer.File) {
    const fileName = file ? `${Date.now()}_${file.originalname}` : null;
    const ext = file ? file.mimetype.split('/')[1] : null;
    const imageUrl = file ? await this.awsService.imageUploadToS3(fileName, file, ext) : null;
    const diary = await this.diaryRepository.findOne({ where: { diary_uuid: diaryUuid, plant: { plant_uuid: plantUuid } } });

    if (!diary) {
      throw new NotFoundException(`Diary #${diaryUuid} not found`);
    }


    Object.assign(diary, updateDiaryDto);
    diary.image_url = imageUrl || diary.image_url;

    await this.diaryRepository.save(diary);

    return diary;
  }



  async findAll(date?: string, plant?: string) {
    const whereConditions: any = {};

    // Check if plant is provided and match it against the plant_uuid
    if (plant) {
      whereConditions['plant'] = { plant_uuid: plant };
    }

    // Check if date is provided and match it against the diary_date
    if (date) {
      whereConditions['diary_date'] = date;
    }

    // Filter based on the provided conditions
    const diaries = await this.diaryRepository.find({
      where: whereConditions,
      relations: ['plant']
    });

    if (!diaries.length) {
      throw new NotFoundException(`Diaries not found with the provided parameters.`);
    }

    return diaries;
  }

  async findOne(plantUuid: string, diaryUuid: string) {
    const diary = await this.diaryRepository.findOne({
      where: {
        diary_uuid: diaryUuid,
        plant: { plant_uuid: plantUuid }
      },
      relations: ['plant']
    });
    if (!diary) {
      throw new NotFoundException(`Diary with UUID ${diaryUuid} not found`);
    }
    return diary;
  }




  async remove(plantUuid: string, diaryUuid: string) {
    // const deleteResult = await this.diaryRepository.delete({ diary_uuid: diaryUuid, plant_uuid: plantUuid });
    // if (deleteResult.affected === 0) throw new NotFoundException(`Diary #${diaryUuid} not found`);
    return true;
  }
}
