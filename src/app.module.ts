import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { PlantsModule } from './plants/plants.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesModule } from './devices/devices.module';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { FilesModule } from './files/files.module';
import {MulterModule} from "@nestjs/platform-express";
import {FilesService} from "./files/files.service";
import {AwsModule} from "./aws/aws.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DevicesModule,
        EventsModule,
        PlantsModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
                type: config.get<'postgres'>('DB_TYPE'),
                host: config.get<string>('DB_HOST'),
                port: config.get<number>('DB_PORT'),
                username: config.get<string>('DB_USERNAME'),
                password: config.get<string>('DB_PASSWORD'),
                database: config.get<string>('DB_DATABASE'),
                synchronize: false,
                autoLoadEntities: true,
                ssl : {
                    "rejectUnauthorized" : false
                }
            }),
        }),
        PlantsModule,
        DevicesModule,
        FilesModule,
        MulterModule.registerAsync({
            useClass: FilesService,
        }),
        AwsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
