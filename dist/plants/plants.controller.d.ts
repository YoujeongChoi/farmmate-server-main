/// <reference types="multer" />
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Plant } from "./entities/plant.entity";
import { AwsService } from "../aws/aws.service";
import { DiagnosePlantDto } from "./dto/diagnose-plant.dto";
import { Response } from "express";
import { DiagnoseResultDto } from "./dto/diagnose-result.dto";
import { CreateDiseaseDto } from "./dto/create-disease.dto";
import { UpdateDiseaseDto } from "./dto/update-disease.dto";
export declare class PlantsController {
    private readonly plantsService;
    private readonly awsService;
    constructor(plantsService: PlantsService, awsService: AwsService);
    getAllByDeviceId(deviceId: string): Promise<Plant[]>;
    findOne(plantUuid: string): Promise<any>;
    create(createPlantDto: CreatePlantDto, files: {
        plantImg?: Express.Multer.File[];
    }): Promise<Plant[]>;
    remove(plant_uuid: string): Promise<void>;
    update(plantUuid: string, updatePlantDto: UpdatePlantDto, files: {
        plantImg?: Express.Multer.File[];
    }): Promise<Plant[]>;
    bookmark(plantUuid: string, response: Response): Promise<Response>;
    getAllBookmarksByDeviceId(deviceId: string): Promise<Plant[]>;
    private readonly logger;
    diagnosePlant(diagnosePlantDto: DiagnosePlantDto, image: Express.Multer.File): Promise<any>;
    saveDiagnoseResult(diagnoseResultDto: DiagnoseResultDto): Promise<any>;
    getDiagnoseResult(plantDiseaseUuid: string): Promise<any>;
    getAllDiagnoseResultsByPlant(plantUuid: string): Promise<any>;
    createDisease(createDiseaseDto: CreateDiseaseDto, file: Express.Multer.File): Promise<any>;
    updateDisease(diseaseUuid: string, updateDiseaseDto: UpdateDiseaseDto, file: Express.Multer.File): Promise<any>;
}
