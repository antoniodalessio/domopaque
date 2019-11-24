import Sensor from '@interface/sensor'
import Device from '@interface/device';
import AbstractController from './abstract.controller';

class SensorController extends AbstractController{
    
  private _device:Device;

  constructor(device, sensor) {
    super()
    this.device = device;
    this.type = Object.keys(sensor)[0];
    this.name = `${device.name}_${this.type}`
    this.value = sensor[this.type]
  }

  getData() {
    let data: Sensor = {
          name: this.name,
          type: this.type,
          value: this.value,
          timestamp: Date.now()
      }
    
    return data
  }

  set device(device) {
      this._device = device;
  }

  get device() {
      return this._device
  }
}

export default SensorController;