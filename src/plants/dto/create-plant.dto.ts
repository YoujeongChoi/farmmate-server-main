import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreatePlantDto {
    @IsString()
    @IsOptional()
    readonly deviceId: string;

    @IsString()
    @IsOptional()
    readonly plantType: string;

    @IsString()
    @IsOptional()
    readonly plantLocation: string;

    @IsString()
    @IsOptional()
    readonly memo: string;

    @IsString()
    @IsOptional()
    readonly firstPlantingDate: string;

    @IsString()
    @IsOptional()
    readonly imageUrl: string;
}
