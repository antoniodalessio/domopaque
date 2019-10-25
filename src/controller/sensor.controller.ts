import Sensor from './../model/sensor'
import Device from '../model/device';

class SensorController implements Sensor{
    
    name: string = '';
    type: string = '';
    private _value:any = '';
    private _device:Device;

    constructor(device, sensor) {
        this.device = device;
        this.type = Object.keys(sensor)[0];
        this.name = `${device.name}_${this.type}`
        this.value = sensor[this.type]
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
}

export default SensorController;