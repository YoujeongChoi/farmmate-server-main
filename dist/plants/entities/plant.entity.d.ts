import { Device } from "../../devices/entities/device.entity";
export declare class Plant {
    plant_uuid: string;
    device: Device;
    plant_type: string;
    plant_name: string;
    plant_location: string;
    memo: string;
    first_planting_date: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date | null;
    image_url?: string;
}
