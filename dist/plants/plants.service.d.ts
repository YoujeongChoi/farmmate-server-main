import { Repository } from 'typeorm';
import { Plant } from './entities/plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Device } from "../devices/entities/device.entity";
export declare class PlantsService {
    private plantsRepository;
    private deviceRepository;
    constructor(plantsRepository: Repository<Plant>, deviceRepository: Repository<Device>);
    getAll(): Promise<Plant[]>;
    getOne(plant_uuid: string): Promise<Plant>;
    create(plantData: CreatePlantDto): Promise<Plant>;
    deleteOne(plant_uuid: string): Promise<void>;
    update(plant_uuid: string, updateData: UpdatePlantDto): Promise<Plant>;
    getAllByDeviceId(deviceId: string): Promise<Plant[]>;
}
