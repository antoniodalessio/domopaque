import Sensor from './sensor'
import Actuator from './actuator'

interface Device {
  name: string,
  ip?: string,
  type?: string,
  sensors?: Sensor[],
  actuators?: Actuator[],
  availableEndpoint?: string[],
  error?: Error
}

interface Error {
  msg: string
  code: number
}

export default Device;