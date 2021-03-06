import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from "typeorm";
import { SceneryActuators } from "./scenary_actuators";

@Entity()
export class Scenery {
    
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;

  @OneToMany(type => SceneryActuators, actuators => actuators.scenery)
  @JoinTable()
  actuators: SceneryActuators[];


}