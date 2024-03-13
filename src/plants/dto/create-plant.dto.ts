import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreatePlantDto {
    @IsString()
    @IsOptional()
    readonly deviceId: string ;

    @IsString()
    @IsOptional()
    readonly plantType: string | null;

    @IsString()
    @IsOptional()
    readonly plantName: string | null;

    @IsString()
    @IsOptional()
    readonly plantLocation: string | null;

    @IsString()
    @IsOptional()
    readonly memo: string | null;

    @IsString()
    @IsOptional()
    readonly firstPlantingDate: string | null;

    @IsString()
    @IsOptional()
    readonly imageUrl: string | null;
}
