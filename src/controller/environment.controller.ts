import Environment from '../interface/environment'
import Device from '../interface/device';
import Sensor from '../interface/sensor';
import DeviceController from './device.controller'

import { fetchPromise, timerPromise } from './../helpers/promiseHelper'

import { config } from '../config'

export default class EnvironmentController implements Environment{
	
  sensors:Sensor[] = []

  name: string
  type: string
  color: string
  ips: []
  lastTimestampPing: number
  inside: boolean
  private _devices:Device[] = [];
  private _devicesController = {};

	constructor(environment) {
    this.name =  environment.name,
		this.color = environment.color,
    this.type =  environment.type,
		this.ips =  environment.ips
    this.inside = environment.inside
  }

  async createDevices() {
    for (const ip of this.ips) {
      let url = `http://${ip}:${config.devicePort}/ping`
      let deviceName = `${this.name}_${ip}`

      let race = Promise.race([timerPromise(config.fetchTimeout), fetchPromise(url, {}, `Timeout del server ${url}`)])
      let deviceData = await race;

      if (!deviceData) {
        deviceData = {
          name: deviceName,
          deviceName,
          ip: ip,
          error: { 
            msg: `device doesn't responding: ${ip} over ${config.fetchTimeout / 1000} seconds`,
            code: 404,
          }
        }        
      }

      if (!this.devicesController[deviceName]){
        let deviceController:DeviceController = new DeviceController(await this.getData(), deviceData);
        this.devicesController[deviceName] = deviceController;
        let device:Device = this.devicesController[deviceName].getData()
        this.devices.push(device)
      }else{
        this.devicesController[deviceName].refresh(deviceData)
        let pos = this.devices.map(function(e) { return e.name }).indexOf(deviceName);
        this.devices[pos] = this.devicesController[deviceName].getData()
      }


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
    await this.createDevices()
  }
  
  get devices() {
    return this._devices;
  }

  set devices(device) {
    this._devices = device
  }

  get devicesController() {
    return this._devicesController;
  }

  set devicesController(devicesController) {
    this._devicesController = devicesController
  }

}