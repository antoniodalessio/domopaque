"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes = require('express').Router();
const GoogleHome_controller_1 = require("../controller/GoogleHome.controller");
function initGoogleHomeRoutes() {
    routes.post('/speak', function (req, res) {
        let msg = req.body.msg;
        let GHCtrl = new GoogleHome_controller_1.default();
        GHCtrl.speak(msg);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ msg }));
    });
}
exports.default = () => {
    initGoogleHomeRoutes();
    return routes;
};
//# sourceMappingURL=googleHomeRoutes.js.map