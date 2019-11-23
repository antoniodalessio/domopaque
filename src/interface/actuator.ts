interface Actuator {
    name: string,
    type: string,
    value: string,
    state?: boolean,
    timestamp: number
}

export default Actuator;