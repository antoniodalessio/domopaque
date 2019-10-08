interface Sensor {
    name: string,
    type: string,
    value?: any,
    pin?: number,
    code?: string,
    state?: boolean,
    timestamp?: number
}

export default Sensor;