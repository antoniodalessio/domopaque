const routes = require('express').Router();

function initSceneryRoutes() {

  routes.get('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({scenery: 'all'}));
  });

  routes.get('/:id', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({}));
  });

  /*
  * Update scenario.
  * Store current state of devices in order to restore when scenario is turned off.
  * Set the status of each device when an event triggered or user set in manual mode
  */
  routes.put('/:id', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({}));
  });

}

export default () => {
  initSceneryRoutes();
  return routes
};