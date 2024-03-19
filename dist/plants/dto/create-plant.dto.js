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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePlantDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreatePlantDto {
}
exports.CreatePlantDto = CreatePlantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '디바이스 id(FK)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePlantDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '식물 종류' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePlantDto.prototype, "plantType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '식물 이름' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePlantDto.prototype, "plantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '식물 위치' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePlantDto.prototype, "plantLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '메모' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePlantDto.prototype, "memo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '처음 식물 심은 날짜 (Date 타입)' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePlantDto.prototype, "firstPlantingDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '이미지' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePlantDto.prototype, "imageUrl", void 0);
//# sourceMappingURL=create-plant.dto.js.map