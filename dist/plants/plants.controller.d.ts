/// <reference types="multer" />
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Plant } from "./entities/plant.entity";
import { AwsService } from "../aws/aws.service";
import { DiagnosePlantDto } from "./dto/diagnose-plant.dto";
export declare class PlantsController {
    private readonly plantsService;
    private readonly awsService;
    constructor(plantsService: PlantsService, awsService: AwsService);
    findOne(plantUuid: string): Promise<Plant>;
    create(createPlantDto: CreatePlantDto, files: {
        plantImg?: Express.Multer.File[];
    }): Promise<Plant>;
    remove(plant_uuid: string): Promise<void>;
    update(plant_uuid: string, updateData: UpdatePlantDto): Promise<Plant>;
    getAllByDeviceId(deviceId: string): Promise<Plant[]>;
    diagnosePlant(diagnosePlantDto: DiagnosePlantDto, image: Express.Multer.File): Promise<any>;
}
