import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Plant } from "./plant.entity"
import {Device} from "../../devices/entities/device.entity";

@Entity({schema: 'app', name : 'bookmark'})
export class Bookmark {
    @PrimaryGeneratedColumn('uuid')
    bookmark_uuid : string;

    @ManyToOne(() => Plant, plant => plant.plant_uuid, { nullable: true })
    @JoinColumn({ name: 'plant_uuid' })
    plant: Plant;

    @ManyToOne(() => Device, device => device.device_id, { nullable: true })
    @JoinColumn({ name: 'device_id' })
    device: Device;

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @DeleteDateColumn({ nullable: true, type: 'timestamp' })
    deleted_at?: Date | null;
}