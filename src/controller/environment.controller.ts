import Environment from '../model/environment'
import Device from '../model/device';
import Sensor from '../model/sensor';

var sensorLib = require('node-dht-sensor');

import { config } from '../config'

export default class EnvironmentController {
	
  data:Environment;
  sensors:Sensor[] = []

	constructor(environment) {
		this.data = {
			name: environment.name,
			color: environment.color,
			type: environment.type,
			ips: environment.ips
    }
    
    if (environment.type == 'master') {
      environment.sensors.forEach(sensor => {
        let sens = {
          name: '',
          pin: sensor.pin,
          type: sensor.type,
        }

        if (!sensorLib.initialize(sensor.type, sensor.pin)) {
          console.warn('Failed to initialize sensor');
        }

        this.sensors.push(sens)
      });
    }
  }
  

  createSensor(deviceData, key, device) {
    let sensor:Sensor = {
      name: `${device.name}_${key}`,
      type: key,
      value: deviceData[key],
      timestamp: Date.now()
    }
    return sensor;
  }

  timerPromise(time) {
    return new Promise(function(resolve, reject) {
      setTimeout(resolve, time, null);
    });
  }

  fetchPromise(url) {
    return new Promise(function(resolve, reject) {
      fetch(url)
        .then((res) => resolve(res.json()))
        .catch(() => {console.error(`Timeout del server ${url}`)})
    });
  }

  fetchTimeout(url, time) {
    return Promise.race([this.timerPromise(time), this.fetchPromise(url)])
  }

  async createSlaveDevices (ips) {
    let devices:Device[] = []

    for (const ip of ips) {
      let url = `http://${ip}:3005/ping`
      //@todo let implement a wrapper function to manage fetch With Timeout
      let race = Promise.race([this.timerPromise(config.fetchTimeout), this.fetchPromise(url)])

      let data = await race;

      if (data) {      
        let device:Device = {
          name: `${this.data.name}_${ip}`,
          ip: ip,
          sensors: []
        }
        
        if (data.hasOwnProperty("temperature")) {
          let temeperature = this.createSensor(data, 'temperature', device)
          device.sensors.push(temeperature)
          let umidity = this.createSensor(data, 'umidity', device)
          device.sensors.push(umidity)
        }
        devices.push(device)
      }else{
        let device:Device = {
          name: ip,
          error: { 
            msg: `device doesn't responding: ${ip} over ${config.fetchTimeout / 1000} seconds`,
            code: 404,
          }
        }
        devices.push(device)
      }
    }

		return devices
  }

  async createMasterSensor() {
    let devices:Device[] = []

    devices[0] = {
      name: 'raspberry'
    }

    let readout = sensorLib.read();
    let temperature = readout.temperature;
    let umidity = readout.humidity;
    this.sensors[0] = {
      name: 'temperature',
      type: "temperature",
      value: temperature,
      timestamp: Date.now()
    }

    this.sensors[1] = {
      name: 'umidity',
      type: "umidity",
      value: umidity,
      timestamp: Date.now()
    }

    devices[0].sensors = this.sensors  

    return devices;
  }

	async createDevices(ips, type) {
    
    if (type == 'slave') return await this.createSlaveDevices(ips)
    // Master is raspberry and there is not devices but only associates sensor
    if (type == 'master') return await this.createMasterSensor()
    
	}

	async getData() {
    let env:Environment = this.data;
    let devices:Device[] = await this.createDevices(this.data.ips, env.type);
		env.devices = devices
		return env
	}

}