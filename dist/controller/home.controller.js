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
const environment_controller_1 = require("./environment.controller");
/*
  --------------------------------------------------------------------
  Builder design pattern
  Create environments, devices, sensors and actuators
  --------------------------------------------------------------------
*/
class HomeController {
    constructor() {
        this._devices = [];
        this._sensors = [];
        this._actuators = [];
        this._virtualActuators = [];
        this.reset();
    }
    static getInstance() {
        if (!HomeController.instance) {
            HomeController.instance = new HomeController();
        }
        return HomeController.instance;
    }
    create(environments) {
        return __awaiter(this, void 0, void 0, function* () {
            this.configEnvironments = environments;
            this.reset();
            for (const environment of environments) {
                let environmentController = new environment_controller_1.default(environment);
                this.environmentsController[environment.name] = environmentController;
                yield environmentController.createDevices();
                yield environmentController.createVirtualActuators();
                let data = yield environmentController.getData();
                this.environments.push(data);
                yield this.listSensors();
                yield this.listActuators();
            }
        });
    }
    reset() {
        this.environmentsController = {};
        this.environments = [];
    }
    listActuators() {
        this.actuators = [];
        Object.keys(this.environmentsController).forEach((key) => {
            let devicesController = (this.environmentsController[key]).devicesController;
            Object.keys(devicesController).forEach((key2) => {
                this.actuators = this.actuators.concat(devicesController[key2].actuatorControllers);
            });
        });
        return this.actuators;
    }
    listSensors() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sensors = [];
            Object.keys(this.environmentsController).forEach((key) => {
                let devicesController = (this.environmentsController[key]).devicesController;
                Object.keys(devicesController).forEach((key2) => {
                    this.sensors = this.sensors.concat(devicesController[key2].sensorControllers);
                });
            });
            return this.sensors;
        });
    }
    actuatorByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.actuators.length == 0 && this.listActuators();
            let actuatorController = this.actuators.find((actuator) => { return actuator.name == name; });
            yield actuatorController.refresh();
            return actuatorController;
        });
    }
    listVirtualActuators() {
        this.virtualActuators = [];
        Object.keys(this.environmentsController).forEach((key) => {
            this.virtualActuators = this.virtualActuators.concat(this.environmentsController[key].virtualActuatorsController);
        });
    }
    virtualActuatorByName(name) {
        this.virtualActuators.length == 0 && this.listVirtualActuators();
        let actuatorController = this.virtualActuators.find((actuator) => { return actuator.name == name; });
        return actuatorController;
    }
    getDevices() {
        return Object.keys(this.environmentsController).map((key) => {
            return (this.environmentsController[key]).devicesController;
            /*Object.keys(devicesController).forEach((key2) => {
      
            })
            //return (this.environmentsController[key]).devicesController;*/
        });
    }
    /* JSON RESPONSE  */
    getJSONEnvironments(req, res) {
        let environments = this.environments;
        res.status(200).json({ environments });
    }
    getJSONEnvironmentByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let name = req.params.name;
            let environmentController = this.environmentsController[name];
            if (environmentController) {
                yield environmentController.refresh();
                let data = yield environmentController.getData();
                res.status(200).json(data);
            }
            else {
                res.status(200).json({ error: 'no environment found' });
            }
        });
    }
    getJSONDevices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json(this.getDevices());
        });
    }
    refresh(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.create(this.configEnvironments);
                res.status(200).json({ msg: 'ok' });
            }
            catch (_a) {
                res.status(200).json({ msg: 'ok' });
            }
        });
    }
    //@todo
    getJSONDeviceByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({});
        });
    }
    getJSONActuators(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let actuators = this.listActuators().map((actuator) => {
                return actuator.getData();
            });
            res.status(200).json(actuators);
        });
    }
    getJSONActuatorByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let actuator = yield this.actuatorByName(req.params.name);
            res.status(200).json(actuator.getData());
        });
    }
    setJSONactuatorValue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let actuator = yield this.actuatorByName(req.body.name);
            actuator.setValue(parseInt(req.body.value));
            yield actuator.refresh();
            this.socket.emit('actuator change', { name: req.body.name, value: req.body.value });
            res.status(200).json(actuator.getData());
        });
    }
    getJSONVirtualActuatorByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let actuator = yield this.virtualActuatorByName(req.params.name);
            res.status(200).json(actuator.getData());
        });
    }
    // Set a status from app or any client side applications
    setJSONVirtualActuatorState(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let actuator = this.virtualActuatorByName(req.body.name);
            yield actuator.setValue(parseInt(req.body.value));
            res.status(200).json(actuator.getData());
        });
    }
    // Set a value from External Services. Value doesn't change the state
    setJSONVirtualActuatorValue(req, res) {
        let actuator = this.virtualActuatorByName(req.body.name);
        actuator.value = parseInt(req.body.value);
        this.socket.emit("virtual actuator change status", { name: req.body.name, value: actuator.value });
        res.status(200).json(actuator.getData());
    }
    /* GETTER AND SETTER */
    get configEnvironments() {
        return this._configEnvironments;
    }
    set configEnvironments(val) {
        this._configEnvironments = val;
    }
    get environmentsController() {
        return this._environmentsController;
    }
    set environmentsController(envs) {
        this._environmentsController = envs;
    }
    get environments() {
        return this._environments;
    }
    set environments(envs) {
        this._environments = envs;
    }
    get devices() {
        return this._devices;
    }
    get sensors() {
        return this._sensors;
    }
    set sensors(value) {
        this._sensors = value;
    }
    get actuators() {
        return this._actuators;
    }
    set actuators(val) {
        this._actuators = val;
    }
    get virtualActuators() {
        return this._virtualActuators;
    }
    set virtualActuators(val) {
        this._virtualActuators = val;
    }
    get socket() {
        return this._socket;
    }
    set socket(val) {
        this._socket = val;
    }
}
exports.default = HomeController;
//# sourceMappingURL=home.controller.js.map