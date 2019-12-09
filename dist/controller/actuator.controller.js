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
const config_1 = require("../config");
const promiseHelper_1 = require("@helpers/promiseHelper");
const abstract_controller_1 = require("./abstract.controller");
class ActuatorController extends abstract_controller_1.default {
    constructor(data, actuator) {
        super();
        this.data = data;
        this.name = `${data.ip}_${actuator.name}`;
        this.mainName = `${actuator.name}`;
        this.value = actuator.value;
    }
    getData() {
        let data = {
            name: this.name,
            value: this.value,
            type: 'rele',
            timestamp: Date.now()
        };
        return data;
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `http://${this.data.ip}:${config_1.config.devicePort}/${this.mainName}`;
            let res = yield promiseHelper_1.fetchPromise(url, {}, `No data retrived from ${this.mainName}`);
            this.value = res.value;
        });
    }
    setValue(val) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `http://${this.data.ip}:${config_1.config.devicePort}/${this.mainName}`;
            let res = yield promiseHelper_1.fetchPromise(url, {
                method: 'POST', headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    value: `${val}`
                })
            }, `set value failed on ${this.mainName}`);
        });
    }
    toggle() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.refresh();
            yield this.setValue(parseInt(this.value) ^ 1);
        });
    }
}
exports.default = ActuatorController;
//# sourceMappingURL=actuator.controller.js.map