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

    @ManyToOne(() => Plant, { nullable: true })
    @JoinColumn({ name: 'plant_uuid' })
    plant_uuid: string;

    @ManyToOne(() => Device, { nullable: true })
    @JoinColumn({ name: 'device_id' })
    device_id: string;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn({ nullable: true, type: 'timestamp' })
    deleted_at?: Date | null;
}