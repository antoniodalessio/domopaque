import {  getConnection, getManager } from "typeorm";
import { Scenery } from './../model/scenery'
//import { SceneryActuators } from "./scenary_actuators";


class SceneryController {
  constructor() {

  }

  async getSceneryById(id: number) {
    const scenery = await getConnection().getRepository(Scenery).findOne({id},{ relations: ["actuators"] });
    console.log(scenery)
    return scenery
  }

}


export default SceneryController