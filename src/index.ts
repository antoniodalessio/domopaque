require('module-alias/register')
require('dotenv').config()
var express = require('express')
import { CronJob } from 'cron'
import { createConnection, getConnectionOptions, getConnection } from "typeorm";

import HomeController from '@controller/home.controller'
import { environmentRoutes, googleHomeRoutes, userRoutes } from '@routes'

import { config } from './config'
//import { SensorReadings } from '@model/sensorReadings'

let app = express();
export default app;
initApp()

async function initApp() {

  app.use(express.json());
  app.setMaxListeners(0);

  let server = app.listen(config.serverPort, function () {
    console.log(`Server Running on port ${config.serverPort}!`);
  });

  let homeController: HomeController = HomeController.getInstance();
  setupWebSocket(server, homeController)

  // setup routes
  app.use('/api/home/', environmentRoutes(homeController));
  app.use('/api/googlehome/', googleHomeRoutes())
  app.use('/api/user/', userRoutes())

  await homeController.create(config.environments)
  app.emit("appStarted");
  
  //await initDB()
  //initCron(homeController)
}

function setupWebSocket(server, homeController) {
  const io = require('socket.io')(server);
  io.setMaxListeners(0);
  io.on('connection', (s: any) => {
    homeController.socket = s;
    s.emit('connection init');
    s.on("client response", (res) => {
      console.log(res)
    })
  });
}

async function initDB() {
  try {
    const connectionOptions = await getConnectionOptions();
    // Merge defaultOptions and local options
    Object.assign(connectionOptions, { 
      entities: [`${__dirname}${config.modelPath}`]
    });
    await createConnection(connectionOptions);
  }catch(e) {
    console.log("I can't estabileshed connection with remote db" + e)
  }
}

async function initCron(homeCTRL) {
  const job = new CronJob('0 */1 * * * *', async () => {
    const d = new Date();

    console.log('At time:', d);
    //todo
    await homeCTRL.create(config.environments)
    await homeCTRL.listSensors()
    await insertInSensor(homeCTRL)

  });
  job.start();
}


async function insertInSensor(homeCTRL) {

  let sensorsData = []
  
  for (const sensor of homeCTRL.sensors) {
    const sensorData = sensor.getData()
    sensorsData.push({
      name: sensorData.name,
      timestamp: sensorData.timestamp.toString(),
      value: sensorData.value
    })
  }

  console.log("insertInSensor")

  /*await getConnection()
    .createQueryBuilder()
    .insert()
    .into(SensorReadings)
    .values(sensorsData)
    .execute();*/
}

