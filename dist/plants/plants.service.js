"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const plant_entity_1 = require("./entities/plant.entity");
const device_entity_1 = require("../devices/entities/device.entity");
let PlantsService = class PlantsService {
    constructor(plantsRepository, deviceRepository) {
        this.plantsRepository = plantsRepository;
        this.deviceRepository = deviceRepository;
    }
    getAll() {
        return this.plantsRepository.find();
    }
    async getOne(plant_uuid) {
        const plant = await this.plantsRepository.findOneBy({ plant_uuid });
        if (!plant) {
            throw new common_1.NotFoundException(`Plant with UUID ${plant_uuid} not found`);
        }
        return plant;
    }
    async create(plantData) {
        let deviceInstance = await this.deviceRepository.findOneBy({ device_id: plantData.deviceId });
        const newPlant = this.plantsRepository.create({
            device_id: deviceInstance?.device_id,
            plant_type: plantData.plantType,
            plant_location: plantData.plantLocation,
            memo: plantData.memo,
            first_planting_date: plantData.firstPlantingDate,
            image_url: plantData.imageUrl,
        });
        await this.plantsRepository.save(newPlant);
        return newPlant;
    }
    async deleteOne(plant_uuid) {
        const result = await this.plantsRepository.delete({ plant_uuid });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Plant with UUID ${plant_uuid} not found`);
        }
    }
    async update(plant_uuid, updateData) {
        const plant = await this.getOne(plant_uuid);
        Object.assign(plant, updateData);
        await this.plantsRepository.save(plant);
        return plant;
    }
    async getAllByDeviceId(deviceId) {
        const plants = await this.plantsRepository.find({ where: { device_id: deviceId } });
        return plants;
    }
};
exports.PlantsService = PlantsService;
exports.PlantsService = PlantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(plant_entity_1.Plant)),
    __param(1, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PlantsService);
//# sourceMappingURL=plants.service.js.map