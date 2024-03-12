import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn, DeleteDateColumn
} from 'typeorm';
import {Plant} from "../../plants/entities/plant.entity";

@Entity({ schema: 'app', name: 'diary' })
export class Diary {
    @PrimaryGeneratedColumn('uuid')
    diary_uuid: string;

    @ManyToOne(() => Plant, plant => plant.plant_uuid, { nullable: true })
    @JoinColumn({ name: 'plant_uuid' })
    plant: Plant;

    @Column({ nullable: true, type: 'varchar', length: 255 })
    diary_date?: string | null;

    @Column({ nullable: true, type: 'varchar' })
    plant_weather: string | null;

    @Column({ nullable: true, type: 'varchar' })
    temperature: string | null;

    @Column({ nullable: true, type: 'varchar' })
    humidity: string | null;

    @Column({ nullable: true , type: 'boolean' })
    water_flag: boolean | null;

    @Column({ nullable: true , type: 'boolean' })
    fertilizer_flag: boolean | null;

    @Column({ nullable: true , type: 'boolean' })
    fertilizer_name: string | null;

    @Column({ nullable: true, type: 'varchar' })
    fertilizer_usage: string | null;

    @Column({ nullable: true, type: 'boolean'  })
    pesticide_flag: boolean | null;

    @Column({ nullable: true, type: 'varchar' })
    pesticide_name: string | null;

    @Column({ nullable: true, type: 'varchar' })
    pesticide_usage: string | null;

    @Column({ nullable: true, type: 'varchar' })
    memo: string | null;

    @Column({ nullable: true, type: 'varchar' })
    image_url?: string | null;

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;

    @DeleteDateColumn({ nullable: true, type: 'timestamp' })
    deleted_at?: Date | null;
}
