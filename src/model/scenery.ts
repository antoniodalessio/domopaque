import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from "typeorm";
import { SceneryActuators } from "./scenary_actuators";
import { SceneryTimers } from "./scenery_timers";

@Entity()
export class Scenery {
    
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;


  @OneToMany(type => SceneryTimers, timers => timers.scenery)
  @JoinTable()
  timers: SceneryTimers[];

  @OneToMany(type => SceneryActuators, actuators => actuators.scenery)
  @JoinTable()
  actuators: SceneryActuators[];


}