const routes = require('express').Router();
import SceneryController from '@controller/scenery.controller'


function initSceneryRoutes(homecontroller) {

  let sceneryController = new SceneryController()

  routes.get('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({scenery: 'all'}));
  });

  routes.get('/:id', async function (req, res) {
    res.status(200).json(await sceneryController.getSceneryById(req.params.id));
  });

  /*
  * Update scenario.
  * Store current state of devices in order to restore when scenario is turned off.
  * Set the status of each device when an event triggered or user set in manual mode
  */
  routes.put('/:id', async function (req, res) {
    let scenario = await sceneryController.getSceneryById(req.params.id)
    if (scenario) {
      for (const actuator of scenario.actuators){
        let act = await homecontroller.actuatorByName(actuator.name);
        act.setValue(parseInt(actuator.value))
        await act.refresh()
      }
    }
    await homecontroller.refresh()
    res.status(200).json(homecontroller.environments);
    
  });

}

export default (homecontroller) => {
  initSceneryRoutes(homecontroller);
  return routes
};