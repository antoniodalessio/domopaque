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
require('module-alias/register');
require('dotenv').config();
var express = require('express');
const cron_1 = require("cron");
const typeorm_1 = require("typeorm");
const home_controller_1 = require("@controller/home.controller");
const _routes_1 = require("@routes");
const config_1 = require("./config");
//import { SensorReadings } from '@model/sensorReadings'
let app = express();
exports.default = app;
initApp();
function initApp() {
    return __awaiter(this, void 0, void 0, function* () {
        app.use(express.json());
        app.setMaxListeners(0);
        let server = app.listen(config_1.config.serverPort, function () {
            console.log(`Server Running on port ${config_1.config.serverPort}!`);
        });
        let homeController = home_controller_1.default.getInstance();
        yield setupWebSocket(server, homeController);
        homeController.socket.emit("test");
        // setup routes
        app.use('/api/home/', _routes_1.environmentRoutes(homeController));
        app.use('/api/googlehome/', _routes_1.googleHomeRoutes());
        app.use('/api/user/', _routes_1.userRoutes());
        yield homeController.create(config_1.config.environments);
        app.emit("appStarted");
        //await initDB()
        //initCron(homeController)
    });
}
function setupWebSocket(server, homeController) {
    return __awaiter(this, void 0, void 0, function* () {
        const io = require('socket.io')(server);
        io.setMaxListeners(0);
        return new Promise((resolve) => {
            io.on('connection', (s) => {
                homeController.socket = s;
                resolve(s);
                s.emit('connection init');
                s.on("client response", (res) => {
                    console.log(res);
                });
            });
        });
    });
}
function initDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connectionOptions = yield typeorm_1.getConnectionOptions();
            // Merge defaultOptions and local options
            Object.assign(connectionOptions, {
                entities: [`${__dirname}${config_1.config.modelPath}`]
            });
            yield typeorm_1.createConnection(connectionOptions);
        }
        catch (e) {
            console.log("I can't estabileshed connection with remote db" + e);
        }
    });
}
function initCron(homeCTRL) {
    return __awaiter(this, void 0, void 0, function* () {
        const job = new cron_1.CronJob('0 */1 * * * *', () => __awaiter(this, void 0, void 0, function* () {
            const d = new Date();
            console.log('At time:', d);
            //todo
            yield homeCTRL.create(config_1.config.environments);
            yield homeCTRL.listSensors();
            yield insertInSensor(homeCTRL);
        }));
        job.start();
    });
}
function insertInSensor(homeCTRL) {
    return __awaiter(this, void 0, void 0, function* () {
        let sensorsData = [];
        for (const sensor of homeCTRL.sensors) {
            const sensorData = sensor.getData();
            sensorsData.push({
                name: sensorData.name,
                timestamp: sensorData.timestamp.toString(),
                value: sensorData.value
            });
        }
        console.log("insertInSensor");
        /*await getConnection()
          .createQueryBuilder()
          .insert()
          .into(SensorReadings)
          .values(sensorsData)
          .execute();*/
    });
}
//# sourceMappingURL=index.js.map