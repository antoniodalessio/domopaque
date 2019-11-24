import { config } from '../config'
import { fetchPromise } from '@helpers/promiseHelper'
import Actuator from '@interface/actuator'
import AbstractController from './abstract.controller'

class ActuatorController extends AbstractController{
    
  constructor(data, actuator) {
    super()
    this.data = data;
    this.name = `${data.ip}_${actuator.name}`
    this.mainName = `${actuator.name}`
    this.value = actuator.value
  }

  getData() {
    let data: Actuator = {
      name: this.name,
      value: this.value,
      type: 'rele',
      timestamp: Date.now()
    }
    return data;
  }

  async refresh() {
    let url = `http://${this.data.ip}:${config.devicePort}/${this.mainName}`
    let res:any = await fetchPromise(url, {}, `No data retrived from ${this.mainName}`)
    this.value = res.value
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
  }

  async toggle() {
    await this.refresh()
    await this.setValue(parseInt(this.value) ^1)
  }

}

export default ActuatorController;