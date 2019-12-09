"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_controller_1 = require("./abstract.controller");
class SensorController extends abstract_controller_1.default {
    constructor(device, sensor) {
        super();
        this.device = device;
        this.type = Object.keys(sensor)[0];
        this.name = `${device.name}_${this.type}`;
        this.value = sensor[this.type];
    }
    getData() {
        let data = {
            name: this.name,
            type: this.type,
            value: this.value,
            timestamp: Date.now()
        };
        return data;
    }
    set device(device) {
        this._device = device;
    }
    get device() {
        return this._device;
    }
}
exports.default = SensorController;
//# sourceMappingURL=sensor.controller.js.map