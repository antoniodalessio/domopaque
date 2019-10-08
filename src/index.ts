var express = require('express');
const axios = require('axios');


import GoogleHomeController from './controller/GoogleHome.controller'
import EnvironmentController from './controller/environment.controller'
import { config } from './config'
import Environment from './model/environment'

var app = express();
let environments:Environment[] = [];
let environmentsController = {}

app.listen(3001, async function () {
  console.log('Server Running on port 3001!');
  await initApp()
});

async function initApp() {
  //setInterval(() => {createEnvironments()}, 1000 * 60 * 2)
  await createEnvironments();
  createRoutes();
}

async function createEnvironments() {
  
  for (const environment of config.environments) {
    let environmentController = new EnvironmentController(environment)
    environmentsController[environment.name] = environmentController
    let data = await environmentController.getData()
    environments.push(data)
  }

}


function createRoutes() {
  
  app.get('/google-home/:msg', function (req, res) {
    let GH = new GoogleHomeController();
    GH.speak(req.params.msg)
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({msg: req.params.msg}));
  });
  
  app.get('/environments', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ environments }));
  });
  
  app.get('/environments/:name', async function(req, res) {
    if (environmentsController[req.params.name]) {
      let data = await environmentsController[req.params.name].getData()
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    }else{
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({error: 'no environment found'}));
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




/*var temperature = 0;
var umidity = 0;*/


/*var sensorType = 11;
var sensorPin  = 4;
if (!sensorLib.initialize(sensorType, sensorPin)) {
    console.warn('Failed to initialize sensor');
    process.exit(1);
}*/


// Automatically update sensor value every 2 seconds
/*setInterval(function() {
    var readout = sensorLib.read();
    
    temperature = readout.temperature;
    umidity = readout.humidity.toFixed(1)
    
    console.log('Temperature:', temperature + 'C');
    console.log('Humidity:   ', umidity    + '%');
}, 2000);*/


/*app.get('/temp-umidity', async function (req, res) {

  let dataVeranda = await axios.get('http://192.168.1.10:3005/ping')

  let data = {
    veranda: dataVeranda.data,
    soggiorno: {
      temperature: temperature,
      umidity: umidity,
      deviceName: "soggiorno"
    }
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(data));
});*/