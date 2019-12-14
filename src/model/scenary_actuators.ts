import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable } from "typeorm";
import { Scenery } from "./scenery";

@Entity()
export class SceneryActuators {
    
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;

  @Column()
  value: string;

  @ManyToOne(type => Scenery, scenery => scenery.actuators)
  @JoinTable()
  scenery: Scenery;


}