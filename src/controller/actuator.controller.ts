import { config } from '../config'
import { fetchPromise, timerPromise } from './../helpers/promiseHelper'

class ActuatorController {
    
  private _value: any
  private _name
  private _mainName
  private _data
  
  constructor(data, actuator) {
    this.data = data;
    this.name = `${data.ip}_${actuator.name}`
    this.mainName = `${actuator.name}`
    this.value = actuator.value
  }


  getData() {
    return {
      name: this.name,
      value: this.value,
      type: 'rele',
      timestamp: Date.now()
    }
  }

  async refresh() {
    let url = `http://${this.data.ip}:${config.devicePort}/${this.mainName}`
    let res:any = await fetchPromise(url)
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
      })
  }


  set value(val) {
    this._value = val;
  }

  get value() {
      return this._value
  }

  set name(val) {
    this._name = val;
  }

  get name() {
      return this._name
  }

  set mainName(val) {
    this._mainName = val;
  }

  get mainName() {
      return this._mainName
  }

  get data() {
    return this._data
  }

  set data(val) {
    this._data = val
  }

}

export default ActuatorController;