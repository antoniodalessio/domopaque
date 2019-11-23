const routes = require('express').Router();

import GoogleHomeController from '../controller/GoogleHome.controller'


function initGoogleHomeRoutes() {

  routes.post('/speak', function (req, res) {
    let msg = req.body.msg;
    let GHCtrl = new GoogleHomeController();
    GHCtrl.speak(msg)
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({msg}));
  });

}

export default () => {
  initGoogleHomeRoutes();
  return routes
};