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
class UsersController {
    constructor() {
        this._users = {};
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.users[user.deviceId]) {
                this.users[user.deviceId] = user;
            }
            else {
                this.users[user.deviceId].fcmToken = user.fcmToken;
            }
        });
    }
    getUser(deviceId) {
        return this.users[deviceId];
    }
    /* Return array */
    usersList() {
        return Object.keys(this.users).map((key) => {
            return this.users[key];
        });
    }
    addInfoToUser(user) {
        Object.keys(user).forEach((key) => {
            this.users[user.deviceId][key] = user[key];
        });
    }
    /* Return an object with deviceId keys */
    get users() {
        return this._users;
    }
    set users(val) {
        this._users = val;
    }
}
exports.default = UsersController;
//# sourceMappingURL=users.controller.js.map