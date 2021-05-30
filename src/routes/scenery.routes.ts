const routes = require('express').Router();
import SceneryController from '@controller/scenery.controller'


function initSceneryRoutes(homecontroller: any) {

  let sceneryController = new SceneryController(homecontroller)

  routes.get('/', async function (req: any, res: any) {
    res.status(200).json(await sceneryController.getScenery());
  });

  routes.get('/:id', async function (req: any, res: any) {
    res.status(200).json(await sceneryController.getScenarioById(req.params.id));
  });

  /*
  * Update scenario.
  * Store current state of devices in order to restore when scenario is turned off.
  * Set the status of each device when an event triggered or user set in manual mode
  */
  routes.put('/:id', async function (req: any, res: any) {
      await sceneryController.callScenario(req.params.id)
      await homecontroller.refresh()
      res.status(200).json(homecontroller.environments);
  });

  routes.get('/timer/list', async function (req: any, res: any) {
      const response = await sceneryController.getTimers()
      res.status(200).json(response);
  });

  routes.put('/timer/:id', async function (req: any, res: any) {
      const response = await sceneryController.setTimer(req.params.id, req.body)
      res.status(200).json(response);
  });

  routes.get('/timer/:id', async function (req: any, res: any) {
      const response = await sceneryController.getTimer(req.params.id)
      res.status(200).json(response);
  });

  routes.delete('/timer/:id', async function (req: any, res: any) {
      const response = await sceneryController.deleteTimer(req.params.id)
      res.status(200).json(response);
  });

  routes.post('/timer/', async function (req: any, res: any) {
      const response = await sceneryController.newTimer(req.body.name, req.body.time, req.body.active, req.body.sceneryid)
      res.status(200).json(response);
  });

}

export default (homecontroller: any) => {
  initSceneryRoutes(homecontroller);
  return routes
};