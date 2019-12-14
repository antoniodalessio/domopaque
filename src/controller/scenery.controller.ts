import {  getConnection, getManager } from "typeorm";
import { Scenery } from './../model/scenery'
//import { SceneryActuators } from "./scenary_actuators";


class SceneryController {
  constructor() {

  }

  async getScenery() {
    const scenario = await getConnection().getRepository(Scenery).find({ relations: ["actuators"] });
    return scenario
  }

  async getScenarioById(id: number) {
    const scenario = await getConnection().getRepository(Scenery).findOne({id},{ relations: ["actuators"] });
    return scenario
  }

}


export default SceneryController