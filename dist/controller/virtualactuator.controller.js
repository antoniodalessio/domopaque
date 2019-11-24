"use strict";
/*
  Virtual Actuator implements external apis in order to use external services such as IFTTT, smart life, google assistant etc
*/
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
const abstract_controller_1 = require("./abstract.controller");
class VirtualActuatorController extends abstract_controller_1.default {
    constructor(data) {
        super();
        this.type = data.type;
        this.data = data;
        this.name = data.name;
        this.mainName = `${data.type}_${data.name}`;
        this.value = `undefined`;
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    manageIfttt(val) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = '';
            if (val == 0 || val == "0") {
                url = `https://maker.ifttt.com/trigger/${this.data.off_event}/with/key/${process.env.IFTT_TOKEN}`;
                this.value = 0;
            }
            else {
                url = `https://maker.ifttt.com/trigger/${this.data.on_event}/with/key/${process.env.IFTT_TOKEN}`;
                this.value = 1;
            }
            try {
                let res = yield fetch(url);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    getData() {
        let data = {
            name: this.name,
            timestamp: Date.now(),
            value: this.value
        };
        return data;
    }
    setValue(val) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.type) {
                case "iftt.webhook":
                    yield this.manageIfttt(val);
                    break;
            }
        });
    }
}
exports.default = VirtualActuatorController;
//# sourceMappingURL=virtualactuator.controller.js.map