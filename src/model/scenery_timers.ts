import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable } from "typeorm";
import { Scenery } from "./scenery";

@Entity()
export class SceneryTimers {
    
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;

  @Column()
  timer: string;

  @Column()
  active: boolean;

  @ManyToOne(type => Scenery, scenery => scenery.timers)
  @JoinTable()
  scenery: Scenery;


}