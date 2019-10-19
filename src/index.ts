var express = require('express');
var bodyParser = require("body-parser");
var FCM = require('fcm-node');
var serverKey = 'AAAAzrR9y9g:APA91bGRH3oO0jYrby24Zgou-If_gmynlD4uOHuaKJ4terNeIr9pP90J7Ur4lXCs-F0Mbw2SZR5m3FCKINXvnwNq4bcJ6P5B_UkJqopfO5qB1BqAylGF86yyi8kasl_I0M865pkDCzvQ';
var fcm = new FCM(serverKey);


const Gpio = require('onoff').Gpio;
const relais = new Gpio(4, 'out');
let relaisValue = 1;
relais.writeSync(relaisValue);

setInterval(() => {
  if(relaisValue == 1) {
    relaisValue = 0;
  }else{
    relaisValue = 1;
  }
  relais.writeSync(relaisValue);
}, 5000)

process.on('SIGINT', _ => {
  relais.unexport();
});

import "reflect-metadata";

import GoogleHomeController from './controller/GoogleHome.controller'
import EnvironmentController from './controller/environment.controller'
import { config } from './config'
import Environment from './model/environment'

var app = express();
let environments:Environment[] = [];
let environmentsController = {}
let users = [];

app.use(express.json());

app.listen(3001, async function () {
  console.log('Server Running on port 3001!');
  await initApp()
});

async function initApp() {
  await createEnvironments();
  createRoutes();
}

async function createEnvironments() {
  environmentsController = {}
  for (const environment of config.environments) {
    let environmentController = new EnvironmentController(environment)
    environmentsController[environment.name] = environmentController
    await environmentController.createDevices()
    let data = await environmentController.getData()
    environments.push(data)
  }

}


function sendNotificationToAll() {

  let token = users[0].fcmToken.token;
  console.log()

  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token, 
        collapse_key: 'your_collapse_key',
        
        notification: {
            title: 'Title of your push notification', 
            body: 'Body of your push notification' 
        },
        
        data: {  //you can send only notification or only data(or include both)
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    };
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}


function createRoutes() {
  
  app.post('/google-home', function (req, res) {
    let msg = req.body.msg;
    let GH = new GoogleHomeController();
    GH.speak(msg)
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({msg}));
  });

  app.post('/store-user', function (req, res) {
    console.log("store-user")
    let user = req.body.user;
    console.log("userdeviceID", user.deviceId)
    users.push(user);
    console.log("users: ", users)
    sendNotificationToAll()
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({user}));
  });
  
  app.get('/environments', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ environments }));
  });
  
  app.get('/environments/:name', async function(req, res) {
    if (environmentsController[req.params.name]) {
      await environmentsController[req.params.name].refresh()
      let data = await environmentsController[req.params.name].getData()
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    }else{
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({error: 'no environment found'}));
    }
  });

  app.get('/refresh', async function(req, res) {
    try {
      await createEnvironments()
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ msg: 'ok' }));
    }catch{
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ msg: 'ko' }));
    }
  });
  
  app.get('/devices', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ environments }));
  });
  
  app.get('/devices/:name', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ environments }));
  });
}