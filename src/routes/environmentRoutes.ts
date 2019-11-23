const routes = require('express').Router();

function initEnvironmentRoutes(homeController, socket) {
  routes.get('/refresh', homeController.refresh)
  routes.get('/environments', homeController.getJSONEnvironments)
  routes.get('/environments/:name', homeController.getJSONEnvironmentByName)
  routes.get('/devices', homeController.getJSONDevices)
  routes.get('/devices/:name', homeController.getJSONDeviceByName)
  routes.get('/actuators', homeController.getJSONActuators)
  routes.get('/actuators/:name', homeController.getJSONActuatorByName)
  routes.post('/actuators', (req, res) => { homeController.setJSONactuatorValue(req, res, socket) })
  routes.get('/virtualactuators/:name', homeController.getJSONVirtualActuatorByName);
  routes.post('/virtualactuators', homeController.setJSONVirtualActuatorValue);
  routes.post('/virtualactuators/setStatus', homeController.setJSONVirtualActuatorState)
}

export default (homeCTRL, socket) => {
  initEnvironmentRoutes(homeCTRL, socket);
  return routes
};