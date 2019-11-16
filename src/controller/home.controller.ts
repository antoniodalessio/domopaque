import Environment from '../model/environment'

import EnvironmentController from "./environment.controller"

class HomeController {

  private _environmentsController
  private _environments: Environment[] 
  private _devices = []
  private _sensors = []
  private _actuators = []
  private _virtualActuators = []

  constructor() {
    this.reset()
  }

  async create(environments) {
    this.reset()
    for (const environment of environments) {
      let environmentController = new EnvironmentController(environment)
      this.environmentsController[environment.name] = environmentController
      await environmentController.createDevices()
      await environmentController.createVirtualActuators()
      let data = await environmentController.getData()
      this.environments.push(data)
    }
  }

  reset() {
    this.environmentsController = {}
    this.environments = [];
  }

  listActuators() {

    this.actuators = [];

    Object.keys(this.environmentsController).forEach((key) => {
      let devicesController = (this.environmentsController[key]).devicesController;
      Object.keys(devicesController).forEach((key2) => {
        this.actuators = this.actuators.concat(devicesController[key2].actuatorControllers);
      })
    })

    return this.actuators;
  }

  async actuatorByName(name: String) {
    if (this.actuators.length == 0) {
      this.listActuators()
    }

    let actuatorController = this.actuators.find((actuator) => { return actuator.name == name})
    await actuatorController.refresh();

    return actuatorController
  }

  listVirtualActuators() {
    this.virtualActuators = [];
    
    Object.keys(this.environmentsController).forEach((key) => {
      this.virtualActuators = this.virtualActuators.concat(this.environmentsController[key].virtualActuatorsController)
    })
  }

  virtualActuatorByName(name: String) {
    if (this.virtualActuators.length == 0) {
      this.listVirtualActuators()
    }

    let actuatorController = this.virtualActuators.find((actuator) => { return actuator.name == name})
    //await actuatorController.refresh();

    return actuatorController

  }


  get environmentsController() {
    return this._environmentsController
  }

  set environmentsController(envs) {
    this._environmentsController = envs
  } 

  get environments() {
    return this._environments;
  }

  set environments(envs) {
    this._environments = envs
  } 

  get devices() {
    return this._devices;
  }

  get sensors() {
    return this._sensors
  }

  get actuators() {
    return this._actuators
  }

  set actuators(val) {
    this._actuators = val;
  }

  get virtualActuators() {
    return this._virtualActuators
  }

  set virtualActuators(val) {
    this._virtualActuators = val;
  }

}

export default HomeController;