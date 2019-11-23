import Environment from '../interface/environment'

import EnvironmentController from "./environment.controller"

/* 
  Builder design pattern
  Create environments, devices, sensors and actuators
*/

class HomeController {

  // Singleton Pattern instance
  private static instance: HomeController;

  private configEnvironments
  private _environmentsController
  private _environments: Environment[] 
  private _devices = []
  private _sensors = []
  private _actuators = []
  private _virtualActuators = []

  constructor() {
    this.reset()
  }

  public static getInstance(): HomeController {
    if (!HomeController.instance) {
      HomeController.instance = new HomeController();
    }

    return HomeController.instance;
}

  async create(environments) {
    this.configEnvironments = environments
    this.reset()
    for (const environment of environments) {
      let environmentController = new EnvironmentController(environment)
      this.environmentsController[environment.name] = environmentController
      await environmentController.createDevices()
      await environmentController.createVirtualActuators()
      let data = await environmentController.getData()
      this.environments.push(data)

      await this.listSensors()
      await this.listActuators()

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

  async listSensors() {
    this.sensors = [];

    Object.keys(this.environmentsController).forEach((key) => {
      let devicesController = (this.environmentsController[key]).devicesController;
      Object.keys(devicesController).forEach((key2) => {
        this.sensors = this.sensors.concat(devicesController[key2].sensorControllers);
      })
    })

    return this.sensors;
  }

  async actuatorByName(name: String) {
    
    this.actuators.length == 0 && this.listActuators()
  
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
    this.virtualActuators.length == 0 && this.listVirtualActuators()
    let actuatorController = this.virtualActuators.find((actuator) => { return actuator.name == name})
    return actuatorController
  }

  getDevices() {
    return Object.keys(this.environmentsController).map((key) => {
      return (this.environmentsController[key]).devicesController;
      
      /*Object.keys(devicesController).forEach((key2) => {

      })
      //return (this.environmentsController[key]).devicesController;*/
    })
  }

  /* JSON RESPONSE  */
  getJSONEnvironments(req, res) {
    let environments = this.environments
    res.status(200).json({  });
  }

  async getJSONEnvironmentByName(req, res) {
    let name = req.params.name
    let environmentController = this.environmentsController[name]
    if (environmentController) {
      await environmentController.refresh()
      let data = await environmentController.getData()
      res.status(200).json(data);
    }else{
      res.status(200).json({error: 'no environment found'});
    }
  }

  async getJSONDevices(req, res) {
    res.status(200).json(this.getDevices());
  }

  async refresh(req, res) {
    try {
      await this.create(this.configEnvironments)
      res.status(200).json({ msg: 'ok' });
    }catch{
      res.status(200).json({ msg: 'ok' });
    }
  }

  //@todo
  async getJSONDeviceByName(req, res) {
    res.status(200).json({});
  }

  async getJSONActuators(req, res) {
    let actuators = this.listActuators().map( (actuator) => {
      return actuator.getData()
    });
    res.status(200).json(actuators);
  }

  async getJSONActuatorByName(req, res) {
    let actuator = await this.actuatorByName(req.params.name);
    res.status(200).json(actuator);
  }

  /* GETTER AND SETTER */
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

  set sensors(value) {
    this._sensors = value
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