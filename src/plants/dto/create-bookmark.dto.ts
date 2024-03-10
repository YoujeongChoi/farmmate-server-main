import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateBookmarkDto {
    @IsString()
    readonly plantUuid: string;
}