import Device from './device'

interface Environment {
    name: string,
    color: string,
    type: string,
    ips: [],
    devices?: Device[]
}

export default Environment;