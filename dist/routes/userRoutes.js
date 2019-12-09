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
const routes = require('express').Router();
function initUserRoutes() {
    routes.post('/store-user', function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //await usersController.addUser(req.body.user)
            /*let user = req.body.user;
            notificationCtrl.users.push(user);
            let tokens = notificationCtrl.users.map((user) => {
              return user.fcmToken.token;
            })
            for (const token of tokens) {
              notificationCtrl.sendTo(token)
            }*/
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({}));
        });
    });
}
exports.default = () => {
    initUserRoutes();
    return routes;
};
//# sourceMappingURL=userRoutes.js.map