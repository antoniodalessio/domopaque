import {  getConnection, getManager } from "typeorm";
import { Scenery } from './../model/scenery'
import HomeController from "./home.controller";


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

  async callScenario(id: number, homecontroller: HomeController) {
    let scenario = await this.getScenarioById(id)
    if (scenario) {
      for (const actuator of scenario.actuators){
        let act = await homecontroller.actuatorByName(actuator.name);
        act.setValue(parseInt(actuator.value))
        await act.refresh()
      }
    }
  }

}


export default SceneryController