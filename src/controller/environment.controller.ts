import Environment from '../interface/environment'
import DeviceController from './device.controller'

export default class EnvironmentController implements Environment{

  private _name: string
  private _type: string
  private _color: string
  private _ips: []
  private _inside: boolean
  private _devicesController = {};

	constructor(environment) {
    this.name =  environment.name,
		this.color = environment.color,
    this.type =  environment.type,
		this.ips =  environment.ips
    this.inside = environment.inside
  }

  async createDevices() {
    for (let ip of this.ips) {
      let deviceName = `${this.name}_${ip}`
      this.devicesController[deviceName] = new DeviceController(ip, await this.getData())
      await this.devicesController[deviceName].refresh()
    }
  }

	async getData() {

    let data: Environment = {
      name: this.name,
      type: this.type,
      color: this.color,
      ips: this.ips,
      devices: this.devices,
      inside: this.inside
    }

    return data
  }

  async refresh() {
    for (const keys of Object.keys(this.devicesController)) {
      await this.devicesController[keys].refresh()
    }
  }


  get name() {
    return this._name;
  }
  
  set name(val) {
    this._name = val;
  }

  get type() {
    return this._type;
  }
  
  set type(val) {
    this._type = val;
  }

  get color() {
    return this._color;
  }
  
  set ips(val) {
    this._ips = val;
  }

  get ips() {
    return this._ips;
  }
  
  set color(val) {
    this._color = val;
  }

  get inside() {
    return this._inside;
  }
  
  set inside(val) {
    this._inside = val;
  }

  get devicesController() {
    return this._devicesController;
  }

  set devicesController(devicesController) {
    this._devicesController = devicesController
  }

  get devices() {
    return Object.keys(this.devicesController).map((keys) => { return this.devicesController[keys].getData()})
  }

  

}