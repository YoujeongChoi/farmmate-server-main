/// <reference types="multer" />
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Plant } from "./entities/plant.entity";
import { AwsService } from "../aws/aws.service";
export declare class PlantsController {
    private readonly plantsService;
    private readonly awsService;
    constructor(plantsService: PlantsService, awsService: AwsService);
    getAll(): Promise<Plant[]>;
    findOne(plantUuid: string): Promise<Plant>;
    create(createPlantDto: CreatePlantDto, files: {
        plantImg?: Express.Multer.File[];
    }): Promise<Plant>;
    remove(plant_uuid: string): Promise<void>;
    update(plant_uuid: string, updateData: UpdatePlantDto): Promise<Plant>;
    getAllByDeviceId(deviceId: string): Promise<Plant[]>;
}
