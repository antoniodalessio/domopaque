const routes = require('express').Router();

import { config } from '../config'

function initUserRoutes() {

  routes.post('/store-user', async function (req, res) {

    //await usersController.addUser(req.body.user)

    /*let user = req.body.user;
    notificationCtrl.users.push(user);
    let tokens = notificationCtrl.users.map((user) => {
      return user.fcmToken.token;
    })
    for (const token of tokens) {
      notificationCtrl.sendTo(token)
    }*/
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({}));
  });

}

export default () => {
  initUserRoutes();
  return routes
};