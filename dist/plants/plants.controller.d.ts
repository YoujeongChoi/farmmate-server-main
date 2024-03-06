import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Plant } from "./entities/plant.entity";
export declare class PlantsController {
    private readonly plantsService;
    constructor(plantsService: PlantsService);
    getAll(): Promise<Plant[]>;
    findOne(plant_uuid: string): Promise<Plant>;
    create(plantData: CreatePlantDto): Promise<Plant>;
    remove(plant_uuid: string): Promise<void>;
    update(plant_uuid: string, updateData: UpdatePlantDto): Promise<Plant>;
    getAllByDeviceId(deviceId: string): Promise<Plant[]>;
}
