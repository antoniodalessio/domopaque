import Device from '../interface/device'
import Environment from '../interface/environment';
import SensorController from './sensor.controller';
import ActuatorController from './actuator.controller';

class DeviceController{
    
  private _name: string = '';
  private _type: string = '';
  private _ip: string = '';
  private _sensorControllers = [];
  private _actuatorControllers = []
  private _environment: Environment;
  private _deviceData: any;
  private error:any;
  
  constructor(environment, deviceData) {
    this.environment = environment;
    this.deviceData = deviceData;
    this.name = `${environment.name}_${deviceData.ip}`;
    this.ip =  deviceData.ip;
    deviceData.error && (this.error = deviceData.error)
    this.setSensors()
    this.setActuators()
  }

  getData() {
    let data: Device = {
      name: this.name,
      ip: this.ip,
      type: this.type,
      sensors: this.sensorControllers.map((sensorController) => {return sensorController.getData()}),
      actuators: this.actuatorControllers.map((actuatorController) => {return actuatorController.getData()}),
    }

    this.error && (data.error = this.error)
    
    return data
  }

  setSensors() {
    if (this.deviceData.sensors && this.deviceData.sensors.length > 0 ) {
      this.sensorControllers = this.deviceData.sensors.map((sensor) => {
        let sensorController = new SensorController(this.getData(), sensor)
        return sensorController
      })
    }
  }

  setActuators() {
    if (this.deviceData.actuators && this.deviceData.actuators.length > 0 ) {
      this.actuatorControllers = this.deviceData.actuators.map((actuator) => {
        let actuatorControllers = new ActuatorController(this.getData(), actuator)
        return actuatorControllers
      })
    }
  }

  getActuatorByName(name) {
    let actuators = this.actuatorControllers.map((actuatorController) => {return actuatorController.getData()})
    return actuators.find((actuator) => {actuator.name == name});
  }

  refresh(deviceData) {
      this.deviceData = deviceData;
      this.setSensors()
      this.setActuators()
  }

  set environment(environment) {
      this._environment = environment;
  }

  get environment() {
      return this._environment;
  }

  set deviceData(deviceData) {
      this._deviceData = deviceData;
  }

  get deviceData() {
      return this._deviceData;
  }

  set actuatorControllers(actuatorControllers) {
      this._actuatorControllers = actuatorControllers;
  }

  get actuatorControllers() {
      return this._actuatorControllers;
  }

  set sensorControllers(sensorControllers) {
      this._sensorControllers = sensorControllers;
  }

  get sensorControllers() {
      return this._sensorControllers;
  }

  get name() {
    return this._name
  }

  set name(value) {
    this._name = value
  }

  get type() {
    return this._type
  }

  set type(value) {
    this._type = value
  }

  get ip() {
    return this._ip
  }

  set ip(value) {
    this._ip = value
  }
}

export default DeviceController;