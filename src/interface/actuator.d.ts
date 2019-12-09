interface Actuator {
    name: string,
    friendlyName: string,
    type: string,
    value: string,
    state?: boolean,
    timestamp: number
}

export default Actuator;