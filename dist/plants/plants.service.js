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
exports.FormDataParseBooleanPipe = exports.PlantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const plant_entity_1 = require("./entities/plant.entity");
const device_entity_1 = require("../devices/entities/device.entity");
const bookmark_entity_1 = require("./entities/bookmark.entity");
const disease_entity_1 = require("./entities/disease.entity");
const common_2 = require("@nestjs/common");
const plant_diagnose_entity_1 = require("./entities/plant-diagnose.entity");
const aws_service_1 = require("../aws/aws.service");
let PlantsService = class PlantsService {
    constructor(plantsRepository, deviceRepository, bookmarkRepository, diseaseRepository, awsService) {
        this.plantsRepository = plantsRepository;
        this.deviceRepository = deviceRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.diseaseRepository = diseaseRepository;
        this.awsService = awsService;
    }
    getAll() {
        return this.plantsRepository.find();
    }
    async getAllByDeviceId(deviceId) {
        const plants = await this.plantsRepository.find({
            where: { device: { device_id: deviceId } },
            relations: ['device']
        });
        if (!plants.length) {
            throw new common_1.NotFoundException(`Plants with Device Id ${deviceId} not found`);
        }
        const plantsWithBookmarks = await Promise.all(plants.map(async (plant) => {
            const bookmark = await this.bookmarkRepository.findOne({
                where: { plant: { plant_uuid: plant.plant_uuid } }
            });
            return {
                ...plant,
                bookmark: bookmark ? {
                    bookmark_uuid: bookmark.bookmark_uuid,
                } : null
            };
        }));
        return plantsWithBookmarks;
    }
    async getOne(plant_uuid) {
        const plant = await this.plantsRepository.findOne({
            where: { plant_uuid }
        });
        if (!plant) {
            throw new common_1.NotFoundException(`Plant with UUID ${plant_uuid} not found`);
        }
        const bookmark = await this.bookmarkRepository.findOne({
            where: { plant: { plant_uuid: plant_uuid } }
        });
        const plantResponse = {
            ...plant,
            bookmark: bookmark ? {
                bookmark_uuid: bookmark.bookmark_uuid,
            } : null
        };
        return plantResponse;
    }
    async create(plantData) {
        const deviceInstance = await this.deviceRepository.findOneBy({ device_id: plantData.deviceId });
        const plantDetails = {
            plant_type: plantData.plantType,
            plant_name: plantData.plantName,
            plant_location: plantData.plantLocation,
            memo: plantData.memo,
            first_planting_date: plantData.firstPlantingDate,
            image_url: plantData.imageUrl,
        };
        if (deviceInstance) {
            plantDetails.device = deviceInstance;
        }
        const newPlant = this.plantsRepository.create(plantDetails);
        await this.plantsRepository.save(newPlant);
        return newPlant;
    }
    async update(plant_uuid, updateData) {
        const plant = await this.getOne(plant_uuid);
        const newPlant = {
            plant_type: updateData.plantType,
            plant_name: updateData.plantName,
            plant_location: updateData.plantLocation,
            memo: updateData.memo,
            first_planting_date: updateData.firstPlantingDate,
            image_url: updateData.imageUrl,
        };
        Object.assign(plant, newPlant);
        await this.plantsRepository.save(plant);
        return plant;
    }
    async deleteOne(plant_uuid) {
        const result = await this.plantsRepository.softDelete({ plant_uuid });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Plant with UUID ${plant_uuid} not found`);
        }
    }
    async bookmark(plantUuid) {
        const plant = await this.plantsRepository.findOne({
            where: { plant_uuid: plantUuid },
            relations: ['device'],
        });
        if (!plant) {
            throw new common_1.NotFoundException(`Plant with UUID ${plantUuid} not found.`);
        }
        const existingBookmark = await this.bookmarkRepository.findOne({
            where: { plant: { plant_uuid: plantUuid } },
            withDeleted: true
        });
        if (!existingBookmark) {
            const newBookmark = this.bookmarkRepository.create({
                plant: plant,
                device: plant.device,
            });
            await this.bookmarkRepository.save(newBookmark);
            return '북마크가 등록되었습니다.';
        }
        else {
            if (existingBookmark.deleted_at) {
                existingBookmark.deleted_at = null;
                await this.bookmarkRepository.save(existingBookmark);
                return '북마크가 다시 등록되었습니다.';
            }
            else {
                await this.bookmarkRepository.softDelete({ bookmark_uuid: existingBookmark.bookmark_uuid });
                return '북마크가 해제되었습니다.';
            }
        }
    }
    async findAllBookmarksByDeviceId(deviceId) {
        const bookmarks = await this.bookmarkRepository.find({
            where: { device: { device_id: deviceId }, deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['plant']
        });
        const plantIds = bookmarks.map(bookmark => bookmark.plant?.plant_uuid).filter(uuid => uuid != null);
        if (plantIds.length === 0) {
            return [];
        }
        const plants = await this.plantsRepository.find({
            where: { plant_uuid: (0, typeorm_2.In)(plantIds) }
        });
        return plants;
    }
    async findByPlantTypeAndDiagnosisCode(plantType, diagnosisCode) {
        const disease = await this.diseaseRepository.findOne({
            where: { plantName: plantType, diagnosisCode: diagnosisCode },
        });
        if (!disease) {
            throw new common_1.NotFoundException(`해당 식물 타입(${plantType})과 진단 코드(${diagnosisCode})에 대한 질병 정보를 찾을 수 없습니다.`);
        }
        return disease;
    }
    async saveDiagnoseResult(diagnoseResultDto) {
        const { plantUuid, diseaseUuid } = diagnoseResultDto;
        const plant = await this.plantsRepository.findOne({ where: { plant_uuid: plantUuid } });
        if (!plant) {
            throw new common_1.NotFoundException(`Plant with UUID ${plantUuid} not found.`);
        }
        const disease = await this.diseaseRepository.findOne({ where: { diseaseUuid: diseaseUuid } });
        if (!disease) {
            throw new common_1.NotFoundException(`Disease with UUID ${diseaseUuid} not found.`);
        }
        const plantDisease = new plant_diagnose_entity_1.PlantDisease();
        plantDisease.plant = plant;
        plantDisease.disease = disease;
        return await this.plantsRepository.manager.save(plantDisease);
    }
    async getDiagnoseResult(plantDiseaseUuid) {
        const plantDisease = await this.plantsRepository.manager.findOne(plant_diagnose_entity_1.PlantDisease, {
            where: { plantDiseaseUuid: plantDiseaseUuid },
            relations: ['plant', 'disease']
        });
        if (!plantDisease) {
            throw new common_1.NotFoundException(`PlantDisease with UUID ${plantDiseaseUuid} not found.`);
        }
        return {
            plantDiseaseUuid: plantDisease.plantDiseaseUuid,
            plant: plantDisease.plant,
            disease: plantDisease.disease
        };
    }
    async getAllDiagnoseResultsByPlant(plantUuid) {
        const plant = await this.plantsRepository.findOne({
            where: { plant_uuid: plantUuid }
        });
        if (!plant) {
            throw new common_1.NotFoundException(`Plant with UUID ${plantUuid} not found.`);
        }
        const plantDiseases = await this.plantsRepository.manager.find(plant_diagnose_entity_1.PlantDisease, {
            where: { plant: { plant_uuid: plantUuid } },
            relations: ['disease'],
            order: {
                created_at: 'ASC'
            }
        });
        return plantDiseases.map(pd => ({
            plantDiseaseUuid: pd.plantDiseaseUuid,
            plantUuid: pd.plant?.plant_uuid,
            disease: pd.disease,
            created_at: pd.created_at
        }));
    }
    async createDisease(createDiseaseDto, file) {
        let imageUrl;
        if (file) {
            imageUrl = await this.awsService.imageUploadToS3(`diseases/${Date.now()}_${file.originalname}`, file, file.mimetype.split('/')[1]);
        }
        const disease = this.diseaseRepository.create({
            ...createDiseaseDto,
            plantImg: imageUrl
        });
        return this.diseaseRepository.save(disease);
    }
    async updateDisease(diseaseUuid, updateDiseaseDto, file) {
        const disease = await this.diseaseRepository.findOne({ where: { diseaseUuid } });
        if (!disease) {
            throw new common_1.NotFoundException(`Disease with UUID ${diseaseUuid} not found.`);
        }
        let imageUrl = disease.plantImg;
        if (file) {
            imageUrl = await this.awsService.imageUploadToS3(`diseases/${Date.now()}_${file.originalname}`, file, file.mimetype.split('/')[1]);
        }
        disease.diseaseName = updateDiseaseDto.diseaseName || disease.diseaseName;
        disease.plantName = updateDiseaseDto.plantName || disease.plantName;
        disease.diseaseCode = updateDiseaseDto.diseaseCode || disease.diseaseCode;
        disease.diseaseSymptom = updateDiseaseDto.diseaseSymptom || disease.diseaseSymptom;
        disease.diseaseCause = updateDiseaseDto.diseaseCause || disease.diseaseCause;
        disease.diseaseTreatment = updateDiseaseDto.diseaseTreatment || disease.diseaseTreatment;
        disease.plantImg = imageUrl;
        return this.diseaseRepository.save(disease);
    }
};
exports.PlantsService = PlantsService;
exports.PlantsService = PlantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(plant_entity_1.Plant)),
    __param(1, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __param(2, (0, typeorm_1.InjectRepository)(bookmark_entity_1.Bookmark)),
    __param(3, (0, typeorm_1.InjectRepository)(disease_entity_1.Disease)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        aws_service_1.AwsService])
], PlantsService);
let FormDataParseBooleanPipe = class FormDataParseBooleanPipe {
    transform(value) {
        if (value === 'true') {
            return true;
        }
        else if (value === 'false') {
            return false;
        }
        else {
            throw new common_2.BadRequestException(`Validation failed. Boolean value expected, but received: ${value}`);
        }
    }
};
exports.FormDataParseBooleanPipe = FormDataParseBooleanPipe;
exports.FormDataParseBooleanPipe = FormDataParseBooleanPipe = __decorate([
    (0, common_1.Injectable)()
], FormDataParseBooleanPipe);
//# sourceMappingURL=plants.service.js.map