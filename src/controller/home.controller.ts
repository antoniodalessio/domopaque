import Environment from '@interface/environment'
import EnvironmentController from "./environment.controller"

/*
  --------------------------------------------------------------------
  Builder design pattern
  Create environments, devices, sensors and actuators
  --------------------------------------------------------------------
*/

class HomeController {

  // Singleton Pattern instance
  private static instance: HomeController;

  private _configEnvironments
  private _environmentsController = {}
  private _environments: Environment[]
  private _devices = []
  private _sensors = []
  private _actuators = []

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

    Promise.all(environments.map( async (environment) => {
      let environmentController = new EnvironmentController(environment)
      this.environmentsController[environment.name] = environmentController
      return environmentController.createDevices()
    }))

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

  getDevices() {
    return Object.keys(this.environmentsController).reduce((acc, curr) => {
      return acc.concat(this.environmentsController[curr].devices)
    }, [])
  }

  /* JSON RESPONSE  */
  getJSONEnvironments(req, res) {
    let environments = Object.keys(this.environmentsController).map( (key) => { 
      return this.environmentsController[key].getData()
    })
    res.status(200).json({ environments });
  }

  async getJSONEnvironmentByName(req, res) {
    let name = req.params.name
    let environmentController = this.environmentsController[name]
    if (environmentController) {
      await environmentController.refresh()
      let data = environmentController.getData()
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
      await Promise.all(Object.keys(this.environmentsController).map((key) => {
        return this.environmentsController[key].refresh()
      }))
      res.status(200).json({ msg: 'ok' });
    }catch(e){
      res.status(200).json({ msg: 'ko', error: e });
    }
  }

  async getJSONDeviceByName(req, res) {
    const name = req.params.name
    let device = this.getDevices().find((device) => { return device.name == name}) 
    res.status(200).json(device);
  }

  async getJSONActuators(req, res) {
    let actuators = this.listActuators().map( (actuator) => {
      return actuator.getData()
    });
    res.status(200).json(actuators);
  }

  async getJSONActuatorByName(req, res) {
    let actuator = await this.actuatorByName(req.params.name);
    res.status(200).json(actuator.getData());
  }

  async setJSONactuatorValue (req, res) {
    let actuator = await this.actuatorByName(req.body.name);
    actuator.setValue(parseInt(req.body.value))
    await actuator.refresh()
    res.status(200).json(actuator.getData());
  }

  /* GETTER AND SETTER */
  get configEnvironments() {
    return this._configEnvironments
  }

  set configEnvironments(val) {
    this._configEnvironments = val
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

  set sensors(value) {
    this._sensors = value
  }

  get actuators() {
    return this._actuators
  }

  set actuators(val) {
    this._actuators = val;
  }
}

export default HomeController;
