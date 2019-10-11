import Sensor from './../model/sensor'
import Device from '../model/device';

class SensorController implements Sensor{
    
    name: string = '';
    type: string = '';
    private _value:any = '';
    private _device:Device;
    private _sensorData;

    constructor(device, sensorData) {
        this.device = device;
        this.type = sensorData.key;
        this.sensorData = sensorData;
        this.name = `${device.name}_${sensorData.key}`
        this.value = sensorData.value;
    }

    getData() {
        return {
            name: this.name,
            type: this.type,
            value: this.value,
            timestamp: Date.now()
        }
    }

    public get value() {
        return this._value;
    }

    public set value(val) {
        this._value = val;
    }

    set device(device) {
        this._device = device;
    }

    get device() {
        return this._device
    }

    set sensorData(sensorData) {
        this._sensorData = sensorData;
    }

    get sensorData() {
        return this._sensorData
    }
}

export default SensorController;