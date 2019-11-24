"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sensor_controller_1 = require("./sensor.controller");
const actuator_controller_1 = require("./actuator.controller");
class DeviceController {
    constructor(environment, deviceData) {
        this._name = '';
        this._type = '';
        this._ip = '';
        this._sensorControllers = [];
        this._actuatorControllers = [];
        this.environment = environment;
        this.deviceData = deviceData;
        this.name = `${environment.name}_${deviceData.ip}`;
        this.ip = deviceData.ip;
        deviceData.error && (this.error = deviceData.error);
        this.setSensors();
        this.setActuators();
    }
    getData() {
        let data = {
            name: this.name,
            ip: this.ip,
            type: this.type,
            sensors: this.sensorControllers.map((sensorController) => { return sensorController.getData(); }),
            actuators: this.actuatorControllers.map((actuatorController) => { return actuatorController.getData(); }),
        };
        this.error && (data.error = this.error);
        return data;
    }
    setSensors() {
        if (this.deviceData.sensors && this.deviceData.sensors.length > 0) {
            this.sensorControllers = this.deviceData.sensors.map((sensor) => {
                let sensorController = new sensor_controller_1.default(this.getData(), sensor);
                return sensorController;
            });
        }
    }
    setActuators() {
        if (this.deviceData.actuators && this.deviceData.actuators.length > 0) {
            this.actuatorControllers = this.deviceData.actuators.map((actuator) => {
                let actuatorControllers = new actuator_controller_1.default(this.getData(), actuator);
                return actuatorControllers;
            });
        }
    }
    getActuatorByName(name) {
        let actuators = this.actuatorControllers.map((actuatorController) => { return actuatorController.getData(); });
        return actuators.find((actuator) => { actuator.name == name; });
    }
    refresh(deviceData) {
        this.deviceData = deviceData;
        this.setSensors();
        this.setActuators();
    }
    set environment(environment) {
        this._environment = environment;
    }
    get environment() {
        return this._environment;
    }
    set deviceData(deviceData) {
        this._deviceData = deviceData;
    }
    get deviceData() {
        return this._deviceData;
    }
    set actuatorControllers(actuatorControllers) {
        this._actuatorControllers = actuatorControllers;
    }
    get actuatorControllers() {
        return this._actuatorControllers;
    }
    set sensorControllers(sensorControllers) {
        this._sensorControllers = sensorControllers;
    }
    get sensorControllers() {
        return this._sensorControllers;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }
    get ip() {
        return this._ip;
    }
    set ip(value) {
        this._ip = value;
    }
}
exports.default = DeviceController;
//# sourceMappingURL=device.controller.js.map