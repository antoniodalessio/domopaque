import Environment from '../model/environment'
import Device from '../model/device';
import Sensor from '../model/sensor';

var sensorLib = require('node-dht-sensor');

const axios = require('axios');

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

  async createSlaveDevices (ips) {
    let devices:Device[] = []

    for (const ip of ips) {
      let { data } = await axios.get(`http://${ip}:3005/ping`)
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
    }

		return devices
  }

  async createMasterSensor() {
    let devices:Device[] = []

    devices[0] = {
      name: 'raspberry'
    }

    //type 11 or 22
    this.sensors.forEach((sensor) => {
      if (!sensorLib.initialize(sensor.type, sensor.pin)) {
        console.warn('Failed to initialize sensor');
        let readout = sensorLib.read();
        let temperature = readout.temperature;
        let umidity = readout.humidity;
        sensor.value = {
          temperature,
          umidity
        }
      }
    })

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