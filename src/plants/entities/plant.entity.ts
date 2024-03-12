import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn, DeleteDateColumn
} from 'typeorm';
import {Device} from "../../devices/entities/device.entity";

@Entity({ schema: 'app', name: 'plant' })
export class Plant {
    @PrimaryGeneratedColumn('uuid')
    plant_uuid: string;

    @ManyToOne(() => Device, device => device.device_id, { nullable: true })
    @JoinColumn({ name: 'device_id' })
    device: Device;

    @Column({ nullable: true })
    plant_type: string;


    @Column({ nullable: true })
    plant_name: string;

    @Column({ nullable: true })
    plant_location: string;

    @Column({ nullable: true })
    memo: string;

    @Column({ nullable: true })
    first_planting_date: string;

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;

    @DeleteDateColumn({ nullable: true, type: 'timestamp' })
    deleted_at?: Date | null;

    @Column({ nullable: true })
    image_url?: string;
}
