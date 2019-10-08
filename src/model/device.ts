import Sensor from './sensor'
import Actuator from './actuator'

interface Device {
    name: string,
    color?: string,
    ip?: string,
    sensors?: Sensor[],
    actuators?: Actuator[],
    availableEndpoint?: string[], 
}

export default Device;