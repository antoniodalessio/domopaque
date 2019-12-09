"use strict";
/*
  --------------------------------------------------------------------
  Actuators, sensors and virtual actuators extends this abstract class
  --------------------------------------------------------------------
*/
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractController {
    set value(val) {
        this._value = val;
    }
    get value() {
        return this._value;
    }
    set name(val) {
        this._name = val;
    }
    get name() {
        return this._name;
    }
    set mainName(val) {
        this._mainName = val;
    }
    get mainName() {
        return this._mainName;
    }
    get data() {
        return this._data;
    }
    set data(val) {
        this._data = val;
    }
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }
    get timestamp() {
        return this._timestamp;
    }
    set timestamp(val) {
        this._timestamp = val;
    }
}
exports.default = AbstractController;
//# sourceMappingURL=abstract.controller.js.map