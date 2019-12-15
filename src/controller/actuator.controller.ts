import { config } from '../config'
import { fetchPromise } from '@helpers/promiseHelper'
import Actuator from '@interface/actuator'
import AbstractController from './abstract.controller'

import gs from '../globalScope'

class ActuatorController extends AbstractController{

  public socket
    
  constructor(data, actuator) {
    super()
    this.data = data;
    this.name = `${data.ip}_${actuator.name}`
    this.mainName = `${actuator.name}`
    this.timestamp = Date.now()
    this.value = actuator.value
  }

  getData() {
    let data: Actuator = {
      name: this.name,
      friendlyName: this.mainName,
      value: this.value,
      type: 'rele',
      timestamp: this.timestamp
    }
    return data;
  }

  async refresh() {
    let url = `http://${this.data.ip}:${config.devicePort}/${this.mainName}`
    let res:any = await fetchPromise(url, {}, `No data retrived from ${this.mainName}`)
    this.value = res.value
    this.timestamp = Date.now()
    this.emitEvent()
  }

  async setValue(val) {
    let url = `http://${this.data.ip}:${config.devicePort}/${this.mainName}`
    let res:any = await fetchPromise(url, 
      {
        method: 'POST', headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        value: `${val}`
        })
      }, `set value failed on ${this.mainName}`)
      this.emitEvent()
  }

  async toggle() {
    await this.refresh()
    await this.setValue(parseInt(this.value) ^1)
  }

  emitEvent() {
    gs.socket.emit('actuator change', this.getData())
  }

}

export default ActuatorController;