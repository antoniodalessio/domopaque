import Environment from '../model/environment'
import Device from '../model/device';
import Sensor from '../model/sensor';
import DeviceController from './device.controller'

import { fetchPromise, timerPromise } from './../helpers/promiseHelper'

var sensorLib = require('node-dht-sensor');

import { config } from '../config'

export default class EnvironmentController implements Environment{
	
  sensors:Sensor[] = []

  name: string;
  type: string;
  color: string;
  ips: [];
  lastTimestampPing: number
  private _devices:Device[] = [];
  private _devicesController = {};


	constructor(environment) {
    
    this.name =  environment.name,
		this.color = environment.color,
    this.type =  environment.type,
		this.ips =  environment.ips
    
  }

  async createSlaveDevices () {
    for (const ip of this.ips) {
      let url = `http://${ip}:${config.devicePort}/ping`
      let deviceName = `${this.name}_${ip}`

      let race = Promise.race([timerPromise(config.fetchTimeout), fetchPromise(url)])
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

  async createMasterSensors() {

    let deviceName = "raspberry.device"
    let deviceData = {};
    
    try {
      let res = await sensorLib.read(11, 4);
      
      deviceData = {
        name: deviceName,
        temperature: res.temperature.toFixed(1),
        umidity: res.humidity.toFixed(1),
        deviceName,
        ip: deviceName
      }
    } catch (e){

      deviceData = {
        name: deviceName,
        deviceName,
        ip: deviceName,
        error: { 
          msg: `No sensors connected ${e}`,
          code: 404,
        }
      }     
    }

    if (!this.devicesController[deviceName]){
      console.log("if", deviceData)
      let deviceController:DeviceController = new DeviceController(await this.getData(), deviceData);
      this.devicesController[deviceName] = deviceController;
      let device:Device = this.devicesController[deviceName].getData()
      this.devices.push(device)
    }else{
      console.log("else", deviceData)
      this.devicesController[deviceName].refresh(deviceData)
      let pos = this.devices.map(function(e) { return e.name }).indexOf(deviceName);
      console.log("pos", pos)
      this.devices[pos] = this.devicesController[deviceName].getData()
    }

  }

	async createDevices() {
    
    if (this.type == 'slave') await this.createSlaveDevices()
    // Master is raspberry and there is not devices but only associates sensor
    if (this.type == 'master') await this.createMasterSensors()
    
	}

	async getData() {
    return {
      name: this.name,
      type: this.type,
      color: this.color,
      ips: this.ips,
      devices: this.devices
    }
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