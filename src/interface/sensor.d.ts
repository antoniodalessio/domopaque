interface Sensor {
    name: string,
    type: any,
    value?: any,
    pin?: number,
    code?: string,
    state?: boolean,
    timestamp?: number
}

export default Sensor;