import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Plant } from "./plant.entity"

@Entity({schema: 'app', name : 'bookmark'})
export class Bookmark {
    @PrimaryGeneratedColumn('uuid')
    bookmark_uuid : string;

    @ManyToOne(() => Plant, { nullable: true })
    @JoinColumn({ name: 'plant_uuid' })
    plant_uuid: string;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}