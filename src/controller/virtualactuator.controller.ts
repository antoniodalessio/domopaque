import ActuatorController from './actuator.controller'
import Actuator from '../model/actuator'

class VirtualActuatorController {
  
  data
  name
  mainName
  value
  type
  timestamp

  constructor(data) {
    this.type = data.type
    this.data = data
    this.name = data.name
    this.mainName = `${data.type}_${data.name}`
    this.value = `undefined`
  }

  async refresh() {
  }

  async manageIfttt(val) {
    let url = ''
      if (val == 0 || val == "0") {
          url = `https://maker.ifttt.com/trigger/${this.data.off_event}/with/key/${process.env.IFTT_TOKEN}`
          this.value = 0
      }else{
          url = `https://maker.ifttt.com/trigger/${this.data.on_event}/with/key/${process.env.IFTT_TOKEN}`
          this.value = 1
      }

      try {
          let res:any = await fetch(url)
      }catch(e) {
          console.log(e)
      }
  }

  getData() {
    let obj:Actuator = this;
    this.timestamp = Date.now()
    return obj;
  }

  async setValue(val) {
    switch(this.type) {
      case "iftt.webhook":
        await this.manageIfttt(val) 
        break;
    }
  }
}

export default VirtualActuatorController;