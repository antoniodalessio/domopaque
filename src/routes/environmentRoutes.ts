const routes = require('express').Router();

import { config } from '../config'

function initEnvironmentRoutes(homeController, socket) {

  routes.get('/test', function(req, res) {
    res.status(200).json({});
  })

  routes.get('/refresh', homeController.refresh);
  //routes.get('/environments', homeController.getJSONEnvironments);
  routes.get('/environments', function(req, res) {
    let environments = homeController.environments
    res.status(200).json({ environments });
  });
  routes.get('/environments/:name', homeController.getJSONEnvironmentByName);
  routes.get('/devices', homeController.getJSONDevices)
  routes.get('/devices/:name', homeController.getJSONDeviceByName)
  routes.get('/actuators', homeController.getJSONActuators);
  routes.get('/actuators/:name', homeController.getJSONActuatorByName);

  routes.post('/actuators', async function (req, res) {
    let actuator = await homeController.actuatorByName(req.body.name);
    actuator.setValue(parseInt(req.body.value))
    await actuator.refresh()
    socket.emit('actuator change', {name: req.body.name, value: req.body.value});
    res.status(200).json(actuator.getData());
  });

  routes.get('/virtualactuators/:name', async function (req, res) {
    let actuator = await homeController.virtualActuatorByName(req.params.name);
    res.status(200).json(actuator.getData());
  });

  // Set a status from app or any client side applications
  routes.post('/virtualactuators', async function (req, res) {
    let actuator = homeController.virtualActuatorByName(req.body.name);
    await actuator.setValue(parseInt(req.body.value))
    res.status(200).json(actuator.getData());
  });

  // Set a value from External Serivices. Value doesn't change the state
  routes.post('/virtualactuators/setStatus', function (req, res) {
    let actuator = homeController.virtualActuatorByName(req.body.name);
    actuator.value = parseInt(req.body.value)
    res.status(200).json(actuator.getData());
  })

}

export default (homeCTRL, socket) => {
  initEnvironmentRoutes(homeCTRL, socket);
  return routes
};