require('dotenv').config()
var express = require('express')

import HomeController from './controller/home.controller'
import NotificationController from './controller/notification.controller'
import GoogleHomeController from './controller/GoogleHome.controller'
import { config } from './config'
import UsersController from './controller/users.controller';

var app = express();

let users = [];

let homeController: HomeController = new HomeController();
let notificationCtrl: NotificationController = new NotificationController()
let usersController: UsersController = new UsersController()

app.use(express.json());

let server = app.listen(3001, async function () {
  console.log('Server Running on port 3001!');
  await initApp()
});

const io = require('socket.io')(server);

app.setMaxListeners(0);
io.setMaxListeners(0);

let socket = null;

io.on('connection', (s) => {
  socket = s;
  socket.setMaxListeners(0);
  socket.emit('inizio connessione');
  socket.on('risposta client', function (data) {
    console.log(data);
    });
});

async function initApp() {
  await homeController.create(config.environments)
  createRoutes();
}


function createRoutes() {
  
  app.post('/api/google-home', function (req, res) {
    let msg = req.body.msg;
    let GHCtrl = new GoogleHomeController();
    GHCtrl.speak(msg)
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({msg}));
  });

  app.post('/api/store-user', async function (req, res) {

    await usersController.addUser(req.body.user)

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
    let actuators = homeController.listActuators().map( (actuator) => {
      return actuator.getData()
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(actuators));
  });

  app.get('/api/actuators/:name', async function (req, res) {
    let actuator = await homeController.actuatorByName(req.params.name);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(actuator));
  });

  app.post('/api/actuators', async function (req, res) {
    let actuator = await homeController.actuatorByName(req.body.name);
    actuator.setValue(parseInt(req.body.value))
    await actuator.refresh()
    socket.emit('actuator change', {name: req.body.name, value: req.body.value});
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(actuator.getData()));
  });

  app.get('/api/virtualactuators/:name', async function (req, res) {
    let actuator = await homeController.virtualActuatorByName(req.params.name);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(actuator));
  });

  // Set a status from app or any client side applications
  app.post('/api/virtualactuators', async function (req, res) {
    let actuator = homeController.virtualActuatorByName(req.body.name);
    await actuator.setValue(parseInt(req.body.value))
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(actuator.getData()));
  });

  // Set a value from External Serivices. Value doesn't change the state
  app.post('/api/virtualactuators/setStatus', async function (req, res) {
    let actuator = homeController.virtualActuatorByName(req.body.name);
    await actuator.value(parseInt(req.body.value))
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(actuator.getData()));
  })

}