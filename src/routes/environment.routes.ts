import HomeController from "@controller/home.controller";

const routes = require('express').Router();

function initEnvironmentRoutes(homeController: HomeController) {
  routes.get('/refresh', homeController.refresh)
  routes.get('/environments', (req, res) => { homeController.getJSONEnvironments(req, res) })
  routes.get('/environments/:name', (req, res) => { homeController.getJSONEnvironmentByName(req, res)})
  routes.get('/devices', (req, res) => { homeController.getJSONDevices(req, res) })
  routes.get('/devices/:name', (req, res) => {  homeController.getJSONDeviceByName(req, res) })
  routes.get('/actuators', (req, res) => { homeController.getJSONActuators(req, res) })
  routes.get('/actuators/:name', (req, res) => { homeController.getJSONActuatorByName(req, res) })
  routes.post('/actuators', (req, res) => { homeController.setJSONactuatorValue(req, res) })
}

export default (homeCTRL) => {
  initEnvironmentRoutes(homeCTRL);
  return routes
};