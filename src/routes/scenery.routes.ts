const routes = require('express').Router();
import SceneryController from '@controller/scenery.controller'


function initSceneryRoutes(homecontroller) {

  let sceneryController = new SceneryController()

  routes.get('/', async function (req, res) {
    res.status(200).json(await sceneryController.getScenery());
  });

  routes.get('/:id', async function (req, res) {
    res.status(200).json(await sceneryController.getScenarioById(req.params.id));
  });

  /*
  * Update scenario.
  * Store current state of devices in order to restore when scenario is turned off.
  * Set the status of each device when an event triggered or user set in manual mode
  */
  routes.put('/:id', async function (req, res) {
    await sceneryController.callScenario(req.params.id, homecontroller)
    await homecontroller.refresh()
    res.status(200).json(homecontroller.environments);
  });

}

export default (homecontroller) => {
  initSceneryRoutes(homecontroller);
  return routes
};