import { Scenery, IScenery, SceneryTimers, SceneryActuators } from '../model'
import { Types } from 'mongoose';

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
    const scenery:IScenery[] = await Scenery.find().populate('actuators timers')
    return scenery
  }

  async getScenarioById(id: string) {
    const scenario:IScenery = await Scenery.findOne({_id: id}).populate('actuators timers')
    return scenario
  }

  async callScenario(id: string) {
      let scenario:IScenery = await this.getScenarioById(id)
      if (scenario) {
        for (const actuator of scenario.actuators){
          let act = await this._mainCTRL.actuatorByName(actuator.name);
          act.setValue(parseInt(actuator.value))
          await act.refresh()
        }
      }
  }

  async newTimer(name: string, time: string, active: boolean, sceneryid: string) {
    let scenario:IScenery = await this.getScenarioById(sceneryid)

    const id = new Types.ObjectId()

    const sceneryTimer = SceneryTimers.create({
      _id: id,
      timer: time,
      name: name,
      active: active
    })

    Scenery.updateOne(
      {_id: sceneryid },
      { $push: { timers: sceneryTimer } },
    )

    return sceneryTimer
  }

  async getTimer(idTimer: string) {
      let scenarioTimer = await SceneryTimers.findOne({id: idTimer})
      return scenarioTimer
  }

  async getTimers() {
    let scenarioTimer = await SceneryTimers.find()
    return scenarioTimer
}

  async setTimer(idTimer: any, data: any) {
    SceneryTimers.updateOne({_id: idTimer, timer: data.timer, active: data.active, name: data.name})
    await this.setScenarioTimers()
    return await SceneryTimers.find()
  }

  async deleteTimer(idTimer: any) {

    const response  = {}//= await Scenery.findOne().

    //const response = await SceneryTimers.deleteOne({_id: idTimer})
   
    return response;
  }

  async getScenarioByTimerId(id: string) {
    const scenery: IScenery[] = await Scenery.find().populate('timers')

    let scenario = null

    for (let i = 0; i < scenery.length; i++) {
      for (let j=0; j < scenery[i].timers.length; j++) {
        if (scenery[i].timers[j]._id == id) {
          scenario = scenery[i]
          break;
        }
      }
    }

    return scenario
  }


  async setScenarioTimers() {
    let scenarioTimers = await SceneryTimers.find()

    for (const timer of scenarioTimers) {

      if (!this._jobs.hasOwnProperty(timer.id)) {
        this._jobs[timer._id] = timer
        const job = new CronJob(timer.timer, async () => {
          const scenario = await this.getScenarioByTimerId(timer._id)
          if (scenario) {
            await this.callScenario(scenario._id)
          }
      
        }, null, true, "Europe/Berlin");
        this._jobs[timer._id].job = job
      }

      //on update time
      this._jobs[timer.id].job.setTime(new CronTime(timer.timer))

      timer.active ? this._jobs[timer._id].job.start() : this._jobs[timer._id].job.stop()
      
    }

  }

}


export default SceneryController