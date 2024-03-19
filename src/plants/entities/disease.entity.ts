import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity({ schema: 'app', name: 'disease' })
export class Disease {
    @PrimaryGeneratedColumn('uuid', { name: 'disease_uuid' })
    diseaseUuid: string;

    @Column({ type: 'varchar', length: 500, name: 'plant_name' })
    plantName: string;

    @Column({ type: 'varchar', length: 1000, name: 'disease_name' })
    diseaseName: string;

    @Column({ type: 'integer', name: 'disease_code' })
    diseaseCode: number;

    @Column({ type: 'text', name: 'disease_symptom' })
    diseaseSymptom: string;

    @Column({ type: 'text', name: 'disease_cause' })
    diseaseCause: string;

    @Column({ type: 'text', name: 'disease_treatment' })
    diseaseTreatment: string;

    @Column({ type: 'integer', name: 'diagnosis_code' })
    diagnosisCode: number;

    @Column({ type: 'varchar', nullable: true, name: 'plant_img'})
    plantImg?: string;
}
