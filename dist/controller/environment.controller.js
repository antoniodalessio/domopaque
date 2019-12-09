"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const device_controller_1 = require("./device.controller");
const promiseHelper_1 = require("./../helpers/promiseHelper");
const config_1 = require("../config");
const virtualactuator_controller_1 = require("./virtualactuator.controller");
class EnvironmentController {
    constructor(environment) {
        this.sensors = [];
        this._devices = [];
        this._devicesController = {};
        this._virtualActuatorsController = [];
        this.name = environment.name,
            this.color = environment.color,
            this.type = environment.type,
            this.ips = environment.ips;
        this.inside = environment.inside,
            this.virtualActuators = environment.external_services && environment.external_services.actuators ? environment.external_services.actuators : [];
    }
    createDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const ip of this.ips) {
                let url = `http://${ip}:${config_1.config.devicePort}/ping`;
                let deviceName = `${this.name}_${ip}`;
                let race = Promise.race([promiseHelper_1.timerPromise(config_1.config.fetchTimeout), promiseHelper_1.fetchPromise(url, {}, `Timeout del server ${url}`)]);
                let deviceData = yield race;
                if (!deviceData) {
                    deviceData = {
                        name: deviceName,
                        deviceName,
                        ip: ip,
                        error: {
                            msg: `device doesn't responding: ${ip} over ${config_1.config.fetchTimeout / 1000} seconds`,
                            code: 404,
                        }
                    };
                }
                if (!this.devicesController[deviceName]) {
                    let deviceController = new device_controller_1.default(yield this.getData(), deviceData);
                    this.devicesController[deviceName] = deviceController;
                    let device = this.devicesController[deviceName].getData();
                    this.devices.push(device);
                }
                else {
                    this.devicesController[deviceName].refresh(deviceData);
                    let pos = this.devices.map(function (e) { return e.name; }).indexOf(deviceName);
                    this.devices[pos] = this.devicesController[deviceName].getData();
                }
            }
        });
    }
    createVirtualActuators() {
        return __awaiter(this, void 0, void 0, function* () {
            this.virtualActuatorsController = [];
            for (const actuator of this.virtualActuators) {
                let actuatorController = new virtualactuator_controller_1.default(actuator);
                this.virtualActuatorsController.push(actuatorController);
            }
        });
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                name: this.name,
                type: this.type,
                color: this.color,
                ips: this.ips,
                devices: this.devices,
                inside: this.inside,
                virtualActuators: this.virtualActuatorsController.map((controller) => { return controller.getData(); })
            };
            return data;
        });
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createDevices();
        });
    }
    get devices() {
        return this._devices;
    }
    set devices(device) {
        this._devices = device;
    }
    get devicesController() {
        return this._devicesController;
    }
    set devicesController(devicesController) {
        this._devicesController = devicesController;
    }
    get virtualActuatorsController() {
        return this._virtualActuatorsController;
    }
    set virtualActuatorsController(virtualActuatorsController) {
        this._virtualActuatorsController = virtualActuatorsController;
    }
}
exports.default = EnvironmentController;
//# sourceMappingURL=environment.controller.js.map