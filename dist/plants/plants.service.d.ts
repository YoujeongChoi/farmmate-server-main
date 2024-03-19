/// <reference types="multer" />
import { Repository } from 'typeorm';
import { Plant } from './entities/plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Device } from "../devices/entities/device.entity";
import { Bookmark } from "./entities/bookmark.entity";
import { Disease } from './entities/disease.entity';
import { PipeTransform } from '@nestjs/common';
import { DiagnoseResultDto } from "./dto/diagnose-result.dto";
import { PlantDisease } from "./entities/plant-diagnose.entity";
import { CreateDiseaseDto } from "./dto/create-disease.dto";
import { AwsService } from "../aws/aws.service";
import { UpdateDiseaseDto } from "./dto/update-disease.dto";
export declare class PlantsService {
    private plantsRepository;
    private deviceRepository;
    private bookmarkRepository;
    private diseaseRepository;
    private awsService;
    constructor(plantsRepository: Repository<Plant>, deviceRepository: Repository<Device>, bookmarkRepository: Repository<Bookmark>, diseaseRepository: Repository<Disease>, awsService: AwsService);
    getAll(): Promise<Plant[]>;
    getAllByDeviceId(deviceId: string): Promise<any[]>;
    getOne(plant_uuid: string): Promise<any>;
    create(plantData: CreatePlantDto): Promise<Plant[]>;
    update(plant_uuid: string, updateData: UpdatePlantDto): Promise<Plant[]>;
    deleteOne(plant_uuid: string): Promise<void>;
    bookmark(plantUuid: string): Promise<string>;
    findAllBookmarksByDeviceId(deviceId: string): Promise<Plant[]>;
    findByPlantTypeAndDiagnosisCode(plantType: string, diagnosisCode: number): Promise<any>;
    saveDiagnoseResult(diagnoseResultDto: DiagnoseResultDto): Promise<PlantDisease>;
    getDiagnoseResult(plantDiseaseUuid: string): Promise<any>;
    getAllDiagnoseResultsByPlant(plantUuid: string): Promise<any[]>;
    createDisease(createDiseaseDto: CreateDiseaseDto, file: Express.Multer.File): Promise<any>;
    updateDisease(diseaseUuid: string, updateDiseaseDto: UpdateDiseaseDto, file: Express.Multer.File): Promise<Disease>;
}
export declare class FormDataParseBooleanPipe implements PipeTransform<string, boolean> {
    transform(value: string): boolean;
}
