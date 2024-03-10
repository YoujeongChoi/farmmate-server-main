import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {In, IsNull, Repository} from 'typeorm';
import { Plant } from './entities/plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import {Device} from "../devices/entities/device.entity";
import { Bookmark } from "./entities/bookmark.entity"

import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class PlantsService {
  constructor(
      @InjectRepository(Plant)
      private plantsRepository: Repository<Plant>,
      @InjectRepository(Device)
      private deviceRepository: Repository<Device>,
      @InjectRepository(Bookmark)
      private bookmarkRepository: Repository<Bookmark>
  ) {}

  getAll(): Promise<Plant[]> {
    return this.plantsRepository.find();
  }

  async getOne(plant_uuid: string): Promise<Plant> {
    const plant = await this.plantsRepository.findOneBy({ plant_uuid });
    if (!plant) {
      throw new NotFoundException(`Plant with UUID ${plant_uuid} not found`);
    }
    return plant;
  }

  async create(plantData: CreatePlantDto): Promise<Plant[]> {

    const deviceInstance = await this.deviceRepository.findOneBy({ device_id: plantData.deviceId });

    const plantDetails: any = {
      plant_type: plantData.plantType,
      plant_name: plantData.plantName,
      plant_location: plantData.plantLocation,
      memo: plantData.memo,
      first_planting_date: plantData.firstPlantingDate,
      image_url: plantData.imageUrl,
    };

    // deviceInstance가 null이 아니면 device 필드를 추가합니다.
    if (deviceInstance) {
      plantDetails.device = deviceInstance;
    }

    const newPlant = this.plantsRepository.create(plantDetails);
    await this.plantsRepository.save(newPlant);
    return newPlant;
  }

  async bookmark(plantUuid: string): Promise<string> {
    // 해당 식물의 정보를 조회합니다.
    const plant = await this.plantsRepository.findOne({
      where: { plant_uuid: plantUuid },
      relations: ['device'],
    });

    // 식물이 존재하지 않으면 예외를 발생시킵니다.
    if (!plant) {
      throw new NotFoundException(`Plant with UUID ${plantUuid} not found.`);
    }

    // 북마크를 조회합니다. (이미 존재하는지 확인)
    const existingBookmark = await this.bookmarkRepository.findOne({
      where: { plant: { plant_uuid: plantUuid } },
      withDeleted: true
    });

    // 북마크가 없으면 새로 생성합니다.
    if (!existingBookmark) {
      const newBookmark = this.bookmarkRepository.create({
        plant: plant,
        device: plant.device,
      });
      await this.bookmarkRepository.save(newBookmark);
      return '북마크가 등록되었습니다.';
    } else {
      // 이미 북마크가 있고 삭제된 경우 다시 활성화
      if (existingBookmark.deleted_at) {
        existingBookmark.deleted_at = null;
        await this.bookmarkRepository.save(existingBookmark);
        return '북마크가 다시 등록되었습니다.';
      } else {
        // 이미 북마크가 있는 경우 삭제
        await this.bookmarkRepository.softDelete({ bookmark_uuid: existingBookmark.bookmark_uuid });
        return '북마크가 해제되었습니다.';
      }
    }
  }


  async findAllBookmarksByDeviceId(deviceId: string): Promise<Plant[]> {
    // Fetch all bookmarks where 'device_id' matches and they are not deleted.
    const bookmarks = await this.bookmarkRepository.find({
      where: { device: { device_id: deviceId }, deleted_at: IsNull() },
      relations: ['plant'] // This should match the relation name in Bookmark entity.
    });

    // Extract the plant UUIDs from the bookmarks.
    // The relation in Bookmark entity should automatically resolve to Plant entity,
    // so make sure 'plant' is correctly populated.
    const plantIds = bookmarks.map(bookmark => bookmark.plant?.plant_uuid).filter(uuid => uuid != null);

    if (plantIds.length === 0) {
      return []; // Return an empty array if there are no associated plants.
    }

    // Fetch all plants where 'plant_uuid' is in the list of extracted plant UUIDs.
    const plants = await this.plantsRepository.find({
      where: { plant_uuid: In(plantIds) }
    });

    return plants;
  }






  async deleteOne(plant_uuid: string): Promise<void> {
    const result = await this.plantsRepository.delete({ plant_uuid });
    if (result.affected === 0) {
      throw new NotFoundException(`Plant with UUID ${plant_uuid} not found`);
    }
  }

  async update(plant_uuid: string, updateData: UpdatePlantDto): Promise<Plant> {
    const plant = await this.getOne(plant_uuid);
    Object.assign(plant, updateData);
    await this.plantsRepository.save(plant);
    return plant;
  }

  async getAllByDeviceId(deviceId: string): Promise<Plant[]> {
    const plants = await this.plantsRepository.find({ where: {device : { device_id: deviceId }} });
    return plants;
  }


  /*
  * 진단
  * */
  async diagnose(plantType: string, image: Express.Multer.File): Promise<any> {
    // 이미지 파일을 딥러닝 서버로 전송하는 로직을 구현하세요.
    // 예를 들어, HTTP 클라이언트를 사용할 수 있습니다. 여기서는 axios를 예로 들겠습니다.
    const formData = new FormData();
    formData.append('plantType', plantType);
    formData.append('image', image.buffer, image.originalname);

    // 딥러닝 서버의 엔드포인트 URL에 맞게 수정하세요.
    const response = await axios.post('http://deeplearning-server-url/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // 딥러닝 서버로부터 받은 결과를 클라이언트에 반환합니다.
    return response.data;
  }

  async sendData(plantType: string, imageBuffer: Buffer, imageName: string) {
    const formData = new FormData();
    formData.append('plantType', plantType);
    // 여기서 'image'는 서버가 기대하는 필드 이름이며, `imageBuffer`는 이미지 데이터의 Buffer입니다.
    // 'image/jpeg'는 실제 이미지 타입에 따라 달라질 수 있습니다.
    formData.append('image', imageBuffer, imageName);

    const response = await axios.post('http://deeplearning-server-url/analyze', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return response.data;
  }

}


import { PipeTransform, BadRequestException} from '@nestjs/common';

@Injectable()
export class FormDataParseBooleanPipe implements PipeTransform<string, boolean> {
  transform(value: string): boolean {
    if (value === 'true') {  // 'true' 문자열 처리
      return true;
    } else if (value === 'false') {  // 'false' 문자열 처리
      return false;
    } else {
      throw new BadRequestException(`Validation failed. Boolean value expected, but received: ${value}`);
    }
  }
}

