import {  getConnection, getManager } from "typeorm";
import { Scenery } from './../model/scenery'
import { SceneryTimers } from './../model/scenery_timers'

var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;


class SceneryController {
  
  private _mainCTRL: any
  private _jobs: any

  constructor(mainCtrl: any) {
    this._mainCTRL = mainCtrl
    this._jobs = {}
    this.setScenarioTimers()
  }

  async getScenery() {
    const scenario = await getConnection().getRepository(Scenery).find({ relations: ["actuators"] });
    return scenario
  }

  async getScenarioById(id: number) {
    const scenario = await getConnection().getRepository(Scenery).findOne({id},{ relations: ["actuators"] });
    return scenario
  }

  async callScenario(id: number) {
    let scenario = await this.getScenarioById(id)
    if (scenario) {
      for (const actuator of scenario.actuators){
        let act = await this._mainCTRL.actuatorByName(actuator.name);
        act.setValue(parseInt(actuator.value))
        await act.refresh()
      }
    }
  }

  async newTimer(name: string, time: string, active: boolean, sceneryid: string) {

    const sceneryRepo = getConnection().getRepository(Scenery);
    const scenery = await sceneryRepo.findOne(sceneryid);

    const sceneryTimer = await getConnection().getRepository(SceneryTimers).insert({
      timer: time,
      name: name,
      scenery: scenery,
      active: active
    });

    return sceneryTimer
  }

  async getTimer(idTimer: any) {
    let scenarioTimer:any;
    if (idTimer) {
      scenarioTimer = await getConnection().getRepository(SceneryTimers).findOne({id: idTimer})
    }else {
      scenarioTimer = await getConnection().getRepository(SceneryTimers).find({ relations: ["scenery"] })
    }
    return scenarioTimer
  }

  async setTimer(idTimer: any, time: string, active: boolean) {
    await getConnection().getRepository(SceneryTimers).update(idTimer, { timer: time, active: active });
    await this.setScenarioTimers()
    return await getConnection().getRepository(SceneryTimers).find()
  }

  async deleteTimer(idTimer: any) {
    const response = await getConnection().getRepository(SceneryTimers).delete(idTimer);
    return response;
  }


  async setScenarioTimers() {
    const scenarioTimers = await getConnection().getRepository(SceneryTimers).find({ relations: ["scenery"] })

    for (const timer of scenarioTimers) {

      if (!this._jobs.hasOwnProperty(timer.id)) {
        this._jobs[timer.id] = timer
        const job = new CronJob(timer.timer, async () => {
          await this.callScenario(timer.scenery.id)
      
        }, null, true, "Europe/Berlin");
        this._jobs[timer.id].job = job
      }

      //on update time
      this._jobs[timer.id].job.setTime(new CronTime(timer.timer))

      timer.active ? this._jobs[timer.id].job.start() : this._jobs[timer.id].job.stop()
      
    }

  }

}


export default SceneryController