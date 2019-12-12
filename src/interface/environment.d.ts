import Device from './device'
import VirtualActuatorController from '../controller/virtualactuator.controller';

interface Environment {
  name: string,
  color: string,
  type: string,
  ips: [],
  devices?: Device[],
  inside: Boolean
}

export default Environment;