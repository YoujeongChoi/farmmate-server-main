import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class DiagnosePlantDto {
    @IsString()
    @IsNotEmpty()
    readonly plantType: string; // 식물 타입을 나타내는 필드

    // 이미지 파일은 여기에 직접적으로 정의되지 않습니다. 왜냐하면 파일 업로드는
    // 일반적으로 Multipart Form Data를 사용하여 처리되며, 이는 DTO 외부에서 처리됩니다.
    // 하지만, 필요에 따라 여기에 파일 관련 검증 로직을 추가할 수 있습니다.
}
