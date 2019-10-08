import Device from './device'

interface Environment {
    name: string,
    color: string,
    devices?: Device[]
}

export default Environment;