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
exports.PlantsController = void 0;
const common_1 = require("@nestjs/common");
const plants_service_1 = require("./plants.service");
const create_plant_dto_1 = require("./dto/create-plant.dto");
const update_plant_dto_1 = require("./dto/update-plant.dto");
const platform_express_1 = require("@nestjs/platform-express");
const aws_service_1 = require("../aws/aws.service");
let PlantsController = class PlantsController {
    constructor(plantsService, awsService) {
        this.plantsService = plantsService;
        this.awsService = awsService;
    }
    async getAll() {
        return this.plantsService.getAll();
    }
    async findOne(plantUuid) {
        return this.plantsService.getOne(plantUuid);
    }
    async create(createPlantDto, files) {
        const imageFile = files.plantImg?.[0];
        let imageUrl;
        if (imageFile) {
            imageUrl = await this.awsService.imageUploadToS3(`plants/${Date.now()}_${imageFile.originalname}`, imageFile, imageFile.mimetype.split('/')[1]);
        }
        else {
            imageUrl = null;
        }
        return this.plantsService.create({
            ...createPlantDto,
            imageUrl
        });
    }
    async remove(plant_uuid) {
        return this.plantsService.deleteOne(plant_uuid);
    }
    async update(plant_uuid, updateData) {
        return this.plantsService.update(plant_uuid, updateData);
    }
    async getAllByDeviceId(deviceId) {
        return this.plantsService.getAllByDeviceId(deviceId);
    }
};
exports.PlantsController = PlantsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('/:plantUuid'),
    __param(0, (0, common_1.Param)('plantUuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'plantImg', maxCount: 1 }
    ])),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_plant_dto_1.CreatePlantDto, Object]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)("/:plantUuid"),
    __param(0, (0, common_1.Param)("plant_uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)("/:plantUuid"),
    __param(0, (0, common_1.Param)("plant_uuid")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_plant_dto_1.UpdatePlantDto]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('/device/:deviceId'),
    __param(0, (0, common_1.Param)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "getAllByDeviceId", null);
exports.PlantsController = PlantsController = __decorate([
    (0, common_1.Controller)('api/plant'),
    __metadata("design:paramtypes", [plants_service_1.PlantsService,
        aws_service_1.AwsService])
], PlantsController);
//# sourceMappingURL=plants.controller.js.map