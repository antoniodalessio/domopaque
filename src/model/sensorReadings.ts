import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SensorReadings {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column()
    timestamp: string;
    
    @Column()
    value: string;

}