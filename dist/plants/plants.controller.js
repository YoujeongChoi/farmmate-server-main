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
var PlantsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantsController = void 0;
const common_1 = require("@nestjs/common");
const plants_service_1 = require("./plants.service");
const create_plant_dto_1 = require("./dto/create-plant.dto");
const update_plant_dto_1 = require("./dto/update-plant.dto");
const platform_express_1 = require("@nestjs/platform-express");
const aws_service_1 = require("../aws/aws.service");
const diagnose_plant_dto_1 = require("./dto/diagnose-plant.dto");
const axios_1 = require("axios");
const FormData = require("form-data");
const swagger_1 = require("@nestjs/swagger");
const diagnose_result_dto_1 = require("./dto/diagnose-result.dto");
const create_disease_dto_1 = require("./dto/create-disease.dto");
const update_disease_dto_1 = require("./dto/update-disease.dto");
let PlantsController = PlantsController_1 = class PlantsController {
    constructor(plantsService, awsService) {
        this.plantsService = plantsService;
        this.awsService = awsService;
        this.logger = new common_1.Logger(PlantsController_1.name);
    }
    async getAllByDeviceId(deviceId) {
        return this.plantsService.getAllByDeviceId(deviceId);
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
    async update(plantUuid, updatePlantDto, files) {
        const imageFile = files?.plantImg?.[0];
        let imageUrl;
        let updatedData;
        if (imageFile) {
            imageUrl = await this.awsService.imageUploadToS3(`plants/${Date.now()}_${imageFile.originalname}`, imageFile, imageFile.mimetype.split('/')[1]);
            updatedData = { ...updatePlantDto, imageUrl };
        }
        else {
            updatedData = { ...updatePlantDto };
        }
        return this.plantsService.update(plantUuid, updatedData);
    }
    async bookmark(plantUuid, response) {
        const result = await this.plantsService.bookmark(plantUuid);
        if (result === '북마크가 등록되었습니다.') {
            return response.status(201).json({ code: 201, message: "bookmark" });
        }
        else if (result === '북마크가 다시 등록되었습니다.') {
            return response.status(201).json({ code: 201, message: "bookmark" });
        }
        else {
            return response.status(202).json({ code: 202, message: "cancelled" });
        }
    }
    async getAllBookmarksByDeviceId(deviceId) {
        return this.plantsService.findAllBookmarksByDeviceId(deviceId);
    }
    async diagnosePlant(diagnosePlantDto, image) {
        this.logger.log('Received a request for /diagnose');
        if (!image) {
            throw new common_1.BadRequestException('Image file is required');
        }
        const formData = new FormData();
        formData.append('plantType', diagnosePlantDto.plantType);
        formData.append('image', image.buffer, image.originalname);
        try {
            this.logger.debug(`Sending request to Flask with plantType: ${diagnosePlantDto.plantType} and image: ${image.originalname}`);
            const response = await axios_1.default.post('http://127.0.0.1:5000/predict', formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });
            const disease = await this.plantsService.findByPlantTypeAndDiagnosisCode(diagnosePlantDto.plantType, response.data.predictedClass);
            return disease;
        }
        catch (error) {
            this.logger.error('Failed to diagnose plant', error.message);
            throw new common_1.BadRequestException('Failed to diagnose plant');
        }
    }
    async saveDiagnoseResult(diagnoseResultDto) {
        return this.plantsService.saveDiagnoseResult(diagnoseResultDto);
    }
    async getDiagnoseResult(plantDiseaseUuid) {
        return this.plantsService.getDiagnoseResult(plantDiseaseUuid);
    }
    async getAllDiagnoseResultsByPlant(plantUuid) {
        return this.plantsService.getAllDiagnoseResultsByPlant(plantUuid);
    }
    async createDisease(createDiseaseDto, file) {
        return this.plantsService.createDisease(createDiseaseDto, file);
    }
    async updateDisease(diseaseUuid, updateDiseaseDto, file) {
        return this.plantsService.updateDisease(diseaseUuid, updateDiseaseDto, file);
    }
};
exports.PlantsController = PlantsController;
__decorate([
    (0, common_1.Get)('/device/:deviceId'),
    (0, swagger_1.ApiOperation)({ summary: '디바이스 식물 리스트 조회', description: '디바이스별 생성된 식물 리스트를 조회합니다.' }),
    (0, swagger_1.ApiParam)({
        name: 'deviceId',
        type: 'uuid',
        description: '조회할 디바이스 uuid',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '디바이스 식물 리스트 조회에 성공하였습니다' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '디바이스 식물 리스식ㅁ 조회에 실패하였습니다' }),
    __param(0, (0, common_1.Param)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "getAllByDeviceId", null);
__decorate([
    (0, common_1.Get)('/:plantUuid'),
    (0, swagger_1.ApiOperation)({ summary: '식물 조회', description: '개별 식물 정보를 조회합니다.' }),
    (0, swagger_1.ApiParam)({
        name: 'plantUuid',
        type: 'uuid',
        description: '조회할 식물 uuid',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '식물 조회에 성공하였습니다' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '식물 조회에 실패하였습니다' }),
    __param(0, (0, common_1.Param)('plantUuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '식물 등록', description: '식물 정보를 추가합니다.' }),
    (0, swagger_1.ApiBody)({ type: create_plant_dto_1.CreatePlantDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '식물 등록에 성공하였습니다' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '식물 등록에 실패하였습니다' }),
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
    (0, swagger_1.ApiOperation)({ summary: '식물 삭제', description: '식물을 삭제합니다.' }),
    (0, swagger_1.ApiParam)({
        name: 'plantUuid',
        type: 'uuid',
        description: '삭제할 식물 uuid',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '식물 삭제에 성공하였습니다' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '식물 삭제에 실패하였습니다' }),
    __param(0, (0, common_1.Param)("plantUuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)('/:plantUuid'),
    (0, swagger_1.ApiOperation)({ summary: '식물 수정', description: '식물 내용을 수정합니다.' }),
    (0, swagger_1.ApiBody)({ type: update_plant_dto_1.UpdatePlantDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '식물 수정에 성공하였습니다' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '식물 수정에 실패하였습니다' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'plantImg', maxCount: 1 },
    ])),
    __param(0, (0, common_1.Param)('plantUuid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_plant_dto_1.UpdatePlantDto, Object]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)("/:plantUuid/bookmark"),
    (0, swagger_1.ApiOperation)({ summary: '북마크 등록', description: '북마크를 등록합니다.' }),
    (0, swagger_1.ApiParam)({
        name: 'plantUuid',
        type: 'uuid',
        description: '북마크에 등록할 식물 uuid',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '북마크 등록에 성공하였습니다' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '북마크 등록에 실패하였습니다' }),
    __param(0, (0, common_1.Param)('plantUuid')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "bookmark", null);
__decorate([
    (0, common_1.Get)('/device/:deviceId/bookmark'),
    (0, swagger_1.ApiOperation)({ summary: '디바이스 북마크 리스트 조회', description: '디바이스별 등록한 북마크 리스트를 조회합니다.' }),
    (0, swagger_1.ApiParam)({
        name: 'deviceId',
        type: 'uuid',
        description: '북마크 리스트 조회할 디바이스 uuid',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '북마크 리스트 조회에 성공하였습니다' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '북마크 리스 조회에 실패하였습니다' }),
    __param(0, (0, common_1.Param)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "getAllBookmarksByDeviceId", null);
__decorate([
    (0, common_1.Post)('/diagnose'),
    (0, swagger_1.ApiOperation)({ summary: '작물 병 진단 요청', description: '병 진단을 요청합니다.' }),
    (0, swagger_1.ApiBody)({ type: diagnose_plant_dto_1.DiagnosePlantDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '진단 요청에 성공하였습니다' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '진단 요청에 실패하였습니다' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new common_1.BadRequestException('Unsupported file type'), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [diagnose_plant_dto_1.DiagnosePlantDto, Object]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "diagnosePlant", null);
__decorate([
    (0, common_1.Post)('/diagnose/result'),
    (0, swagger_1.ApiOperation)({ summary: '진단 결과 저장', description: '진단 결과를 저장합니다.' }),
    (0, swagger_1.ApiBody)({ type: diagnose_result_dto_1.DiagnoseResultDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '진단 결과 저장에 성공하였습니다' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '진단 결과 저장에 실패하였습니다' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [diagnose_result_dto_1.DiagnoseResultDto]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "saveDiagnoseResult", null);
__decorate([
    (0, common_1.Get)('/diagnose/result/:plantDiseaseUuid'),
    (0, swagger_1.ApiOperation)({ summary: '진단 결과 조회', description: '특정 진단 결과와 관련된 식물 및 질병 정보를 조회합니다.' }),
    (0, swagger_1.ApiParam)({
        name: 'plantDiseaseUuid',
        type: 'string',
        description: '조회할 진단 결과의 UUID',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '진단 결과 조회에 성공하였습니다' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '진단 결과 조회에 실패하였습니다' }),
    __param(0, (0, common_1.Param)('plantDiseaseUuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "getDiagnoseResult", null);
__decorate([
    (0, common_1.Get)('/diagnose/result/plant/:plantUuid'),
    (0, swagger_1.ApiOperation)({ summary: '식물 진단 결과 리스트 조회', description: '특정 식물에 대한 모든 진단 결과를 조회합니다.' }),
    (0, swagger_1.ApiParam)({
        name: 'plantUuid',
        type: 'string',
        description: '조회할 식물의 UUID',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '식물 진단 결과 리스트 조회에 성공하였습니다' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '식물 진단 결과 리스트 조회에 실패하였습니다' }),
    __param(0, (0, common_1.Param)('plantUuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "getAllDiagnoseResultsByPlant", null);
__decorate([
    (0, common_1.Post)('/disease'),
    (0, swagger_1.ApiOperation)({ summary: '작물 질병 저장', description: '작물 질병을 저장합니다.' }),
    (0, swagger_1.ApiBody)({ type: create_disease_dto_1.CreateDiseaseDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '작물 질병 저장에 성공하였습니다' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '작물 질병 저장에 실패하였습니다' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('plantImg')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_disease_dto_1.CreateDiseaseDto, Object]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "createDisease", null);
__decorate([
    (0, common_1.Put)('/disease/:diseaseUuid'),
    (0, swagger_1.ApiOperation)({ summary: '작물 질병 수정', description: '작물 질병 정보를 수정합니다.' }),
    (0, swagger_1.ApiParam)({
        name: 'diseaseUuid',
        type: 'string',
        description: '수정할 질병의 UUID',
    }),
    (0, swagger_1.ApiBody)({ type: update_disease_dto_1.UpdateDiseaseDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '작물 질병 수정에 성공하였습니다' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '작물 질병 수정에 실패하였습니다' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('plantImg')),
    __param(0, (0, common_1.Param)('diseaseUuid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_disease_dto_1.UpdateDiseaseDto, Object]),
    __metadata("design:returntype", Promise)
], PlantsController.prototype, "updateDisease", null);
exports.PlantsController = PlantsController = PlantsController_1 = __decorate([
    (0, common_1.Controller)('api/plant'),
    __metadata("design:paramtypes", [plants_service_1.PlantsService,
        aws_service_1.AwsService])
], PlantsController);
//# sourceMappingURL=plants.controller.js.map