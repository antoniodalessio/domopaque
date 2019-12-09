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
const app_1 = require("./../app");
const config_1 = require("./../config");
let app = new app_1.default(config_1.config);
let expressApp = app.expressApp;
const request = require('supertest');
var agent = request.agent(expressApp);
beforeAll(function (done) {
    expressApp.on("appStarted", function () {
        done();
    });
});
describe('GET /api/home/environments', () => {
    it('responds with json', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield agent.get('/api/home/environments')
            .set('Accept', 'application/json')
            //.expect('Content-Type', /json/)
            .expect(200)
            .expect("Config successfully added");
        done();
    }));
});
// describe('GET /api/home/actuators', () => {
//     it('responds with json', async (done) => {
//         await request.get('/api/home/actuators')
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .then(response => {
//                 //assert(response.body.email, 'foo@bar.com')
//             })
//         done()
//     })
// })
//# sourceMappingURL=environmentsRoutes.test.js.map