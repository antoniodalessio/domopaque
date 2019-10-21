var express = require('express');


// const Gpio = require('onoff').Gpio;
// const relais = new Gpio(17, 'out');
// let relaisValue = 1;
// relais.writeSync(relaisValue);

// setInterval(() => {
//   if(relaisValue == 1) {
//     relaisValue = 0;
//   }else{
//     relaisValue = 1;
//   }
//   relais.writeSync(relaisValue);
// }, 5000)

// process.on('SIGINT', _ => {
//   relais.unexport();
// });

//import "reflect-metadata";

import HomeController from './controller/home.controller'
import NotificationController from './controller/notification.controller'
import GoogleHomeController from './controller/GoogleHome.controller'
import { config } from './config'

var app = express();
let users = [];

let homeController: HomeController = new HomeController()
let notificationCtrl: NotificationController = new NotificationController()

app.use(express.json());

app.listen(3001, async function () {
  console.log('Server Running on port 3001!');
  await initApp()
});

async function initApp() {
  await homeController.create(config.environments)
  createRoutes();
}


function createRoutes() {
  
  app.post('/api/google-home', function (req, res) {
    let msg = req.body.msg;
    let GH = new GoogleHomeController();
    GH.speak(msg)
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({msg}));
  });

  app.post('/api/store-user', function (req, res) {
    let user = req.body.user;
    notificationCtrl.users.push(user);
    let tokens = notificationCtrl.users.map((user) => {
      return user.fcmToken.token;
    })
    for (const token of tokens) {
      notificationCtrl.sendTo(token)
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({user}));
  });
  
  app.get('/api/environments', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ environments: homeController.environments }));
  });
  
  app.get('/api/environments/:name', async function(req, res) {
    if (homeController.environmentsController[req.params.name]) {
      await homeController.environmentsController[req.params.name].refresh()
      let data = await homeController.environmentsController[req.params.name].getData()
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    }else{
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({error: 'no environment found'}));
    }
  });

  app.get('/api/refresh', async function(req, res) {
    try {
      await homeController.create(config.environments)
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ msg: 'ok' }));
    }catch{
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ msg: 'ko' }));
    }
  });
  
  app.get('/api/devices', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ }));
  });
  
  app.get('/api/devices/:name', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ }));
  });

  app.get('/api/actuators', function (req, res) {

  });

  app.get('/api/actuators/:id', function (req, res) {

  });

  app.post('/api/actuators/:id/:value', function (req, res) {

  });

}