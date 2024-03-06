import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import {Device} from "../../devices/entities/device.entity";

@Entity({ schema: 'app', name: 'plant' })
export class Plant {
    @PrimaryGeneratedColumn('uuid')
    plant_uuid: string;

    @ManyToOne(() => Device, { nullable: true })
    @JoinColumn({ name: 'device_id' })
    device_id: string;

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

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ nullable: true })
    image_url?: string;
}
