import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    DeleteDateColumn
} from 'typeorm';
import {Plant} from "./plant.entity";
import {Disease} from "./disease.entity";

@Entity({ schema: 'app', name: 'plantDisease' })
export class PlantDisease {
    @PrimaryGeneratedColumn('uuid', { name: 'plant_disease_uuid' })
    plantDiseaseUuid: string;

    @ManyToOne(() => Plant, plant => plant.plant_uuid, { nullable: true })


    @JoinColumn({ name: 'plant_uuid' })
    plant: Plant;


    @ManyToOne(() => Disease, disease => disease.diseaseUuid, { nullable: true })
    @JoinColumn({ name: 'disease_uuid' })
    disease: Disease;

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @DeleteDateColumn({ nullable: true, type: 'timestamp' })
    deleted_at?: Date | null;
}
