import Device from './../model/device'
import Sensor from './../model/sensor'
import Environment from '../model/environment';
import SensorController from './sensor.controller';

class DeviceController implements Device{
    
    name: string = '';
    type: string = '';
    ip: string = '';
    sensors: Sensor[] = [];
    _environment: Environment;
    _deviceData: any;
    error:any;

    sensorTypes: string[] = ['temperature', 'umidity', 'raindrop'];

    constructor(environment, deviceData) {
        this.environment = environment;
        this.deviceData = deviceData;
        this.name = `${environment.name}_${deviceData.ip}`;
        this.ip =  deviceData.ip;
        if (deviceData.error) {
            this.error = deviceData.error
        }
        this.setSensors() 
    }

    getData() {
        let returnObj = {
            name: this.name,
            ip: this.ip,
            type: this.type,
            sensors: this.sensors
        }

        if (this.error) {
            returnObj["error"] = this.error
        }
        return returnObj
    }

    setSensors() {
        this.sensors = []
        Object.keys(this.deviceData).forEach((key) => {
            if (this.sensorTypes.indexOf(key) != -1) {
                let sensorData = {
                    key,
                    value: this._deviceData[key]
                }
                let sensorController = new SensorController(this.getData(), sensorData)
                this.sensors.push(sensorController.getData())
            }
        })
    }

    refresh(deviceData) {
        this.deviceData = deviceData;
        this.setSensors()
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
}

export default DeviceController;