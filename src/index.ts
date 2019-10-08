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