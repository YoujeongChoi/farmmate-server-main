import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from './entities/plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import {Device} from "../devices/entities/device.entity";

@Injectable()
export class PlantsService {
  constructor(
      @InjectRepository(Plant)
      private plantsRepository: Repository<Plant>,
      @InjectRepository(Device)
      private deviceRepository: Repository<Device>,
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

  async create(plantData: CreatePlantDto): Promise<Plant> {

    let deviceInstance = await this.deviceRepository.findOneBy({ device_id: plantData.deviceId });

    const newPlant = this.plantsRepository.create({
      device_id: deviceInstance?.device_id,
      plant_type: plantData.plantType,
      plant_location: plantData.plantLocation,
      memo: plantData.memo,
      first_planting_date: plantData.firstPlantingDate,
    });

    await this.plantsRepository.save(newPlant);
    return newPlant;
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
}
