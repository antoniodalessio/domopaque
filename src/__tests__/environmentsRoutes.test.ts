import App from './../app'
import { config } from './../config' 
let app = new App(config)
let expressApp = app.expressApp
const request = require('supertest')
var agent = request.agent(expressApp);


beforeAll(function (done) {
    expressApp.on("appStarted", function(){
        done();
    });
});

describe('GET /api/home/environments', () => {
    it('responds with json', async done => {
        await agent.get('/api/home/environments')
            .set('Accept', 'application/json')
            //.expect('Content-Type', /json/)
            .expect(200)
            .expect("Config successfully added");
            done()
    })
})

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