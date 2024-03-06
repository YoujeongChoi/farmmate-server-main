import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ schema: 'app', name: 'device' })
export class Device {
    @PrimaryColumn()
    device_id: string;

    @CreateDateColumn()
    created_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}
