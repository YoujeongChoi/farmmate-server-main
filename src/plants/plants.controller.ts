import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Plant } from "./entities/plant.entity";

@Controller('api/plant')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Get()
  async getAll(): Promise<Plant[]> {
    return this.plantsService.getAll();
  }

  @Get('/:plant_uuid')
  async findOne(@Param('plant_uuid') plant_uuid: string): Promise<Plant> {
    return this.plantsService.getOne(plant_uuid);
  }

  @Post()
  async create(@Body() plantData: CreatePlantDto): Promise<Plant> {
    return this.plantsService.create(plantData);
  }

  @Delete("/:plant_uuid")
  async remove(@Param("plant_uuid") plant_uuid: string): Promise<void> {
    return this.plantsService.deleteOne(plant_uuid);
  }

  @Patch("/:plant_uuid")
  async update(@Param("plant_uuid") plant_uuid: string, @Body() updateData: UpdatePlantDto): Promise<Plant> { // 메서드 파라미터 이름 변경
    return this.plantsService.update(plant_uuid, updateData);
  }
}
