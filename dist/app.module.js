"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const events_module_1 = require("./events/events.module");
const plants_module_1 = require("./plants/plants.module");
const typeorm_1 = require("@nestjs/typeorm");
const devices_module_1 = require("./devices/devices.module");
const files_module_1 = require("./files/files.module");
const platform_express_1 = require("@nestjs/platform-express");
const files_service_1 = require("./files/files.service");
const aws_module_1 = require("./aws/aws.module");
const diaries_module_1 = require("./diaries/diaries.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            devices_module_1.DevicesModule,
            events_module_1.EventsModule,
            plants_module_1.PlantsModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: config.get('DB_TYPE'),
                    host: config.get('DB_HOST'),
                    port: config.get('DB_PORT'),
                    username: config.get('DB_USERNAME'),
                    password: config.get('DB_PASSWORD'),
                    database: config.get('DB_DATABASE'),
                    synchronize: false,
                    autoLoadEntities: true,
                    ssl: {
                        "rejectUnauthorized": false
                    }
                }),
            }),
            plants_module_1.PlantsModule,
            devices_module_1.DevicesModule,
            files_module_1.FilesModule,
            platform_express_1.MulterModule.registerAsync({
                useClass: files_service_1.FilesService,
            }),
            aws_module_1.AwsModule,
            diaries_module_1.DiariesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map