var colors = require('colors');
var express = require('express')
var expressAccessToken = require('express-access-token')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var socketio = require('socket.io')

import { createConnection, getConnectionOptions, getConnection } from "typeorm";
import { environmentRoutes, googleHomeRoutes, userRoutes, sceneryRoutes } from '@routes'
import HomeController from '@controller/home.controller'

import gs from './globalScope'

class App {

  _expressApp
  _expressServer
  _config
  _socket
  _mainController
  _accessTokens = [ process.env.TOKEN ];

  constructor(config) {
    this.config = config
    this.expressApp = express();
    this.initApp()
  }

  async initApp() {
    this.setupExpress()
    this.setupSocket()
    this.mainController = HomeController.getInstance();
    this.mainController.create(this.config.environments)
    this.setupRoutes()
    this.initDB()
  }

  setupExpress() {
    this.expressApp.use(cookieParser());
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({extended: true}));
    this.expressApp.setMaxListeners(0);
    this.expressServer = this.expressApp.listen(this.config.serverPort, () => { this.onServerStart() });
  }

  firewall = (req, res, next) => {
    const authorized = this.accessTokens.includes(req.accessToken);
    console.log("authorized", authorized)
    if(!authorized) return res.status(403).send('Forbidden');
    next();
  };

  setupSocket() {
    const io = socketio(this.expressServer);
    io.setMaxListeners(0);
    gs.socket = io;
    io.on('connection', (s: any) => {
      s.emit('connection init');
      s.on("client response", (res) => {
        console.log(colors.green("socket", res))
      })
    });
  }

  setupRoutes() {
    this.expressApp.use('/api/home/', expressAccessToken, this.firewall, environmentRoutes(this.mainController));
    this.expressApp.use('/api/googlehome/', expressAccessToken, this.firewall, googleHomeRoutes())
    this.expressApp.use('/api/user/', expressAccessToken, this.firewall, userRoutes())
    this.expressApp.use('/api/scenery/', expressAccessToken, this.firewall, sceneryRoutes(this.mainController))
  }

  onServerStart() {
    console.log(colors.green(`Server Running on port ${this.config.serverPort}!`))
    this.expressApp.emit("appStarted");
  }

  async initDB() {
    try {
      const connectionOptions = await getConnectionOptions();
      // Merge defaultOptions and local options
      Object.assign(connectionOptions, {
        username: process.env.POSTEGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        entities: [`${__dirname}${this.config.modelPath}`]
      });
      await createConnection(connectionOptions)
      console.log(colors.green(`DB sucessfully connected`))
    }catch(e) {
      console.log(colors.red("I can't estabileshed connection with remote db. " + e))
    }
  }

  // GETTER & SETTER
  public set expressApp(val) {
    this._expressApp = val
  }

  public get expressApp() {
    return this._expressApp
  }

  public set expressServer(val) {
    this._expressServer = val
  }

  public get expressServer() {
    return this._expressServer
  }

  public set config(val) {
    this._config = val
  }

  public get config() {
    return this._config
  }

  public set socket(val) {
    this._socket = val
  }

  public get socket() {
    return this._socket
  }

  public set mainController(val) {
    this._mainController = val
  }

  public get mainController() {
    return this._mainController
  }

  public get accessTokens() {
    return this._accessTokens
  }

  public set accessTokens(val) {
    this._accessTokens = val
  }
  
  // async function initCron(homeCTRL) {
  //   const job = new CronJob('0 */1 * * * *', async () => {
  //     const d = new Date();
  
  //     console.log('At time:', d);
  //     //todo
  //     await homeCTRL.create(config.environments)
  //     await homeCTRL.listSensors()
  //     await insertInSensor(homeCTRL)
  
  //   });
  //   job.start();
  // }
  
  
  // async function insertInSensor(homeCTRL) {
  
  //   let sensorsData = []
    
  //   for (const sensor of homeCTRL.sensors) {
  //     const sensorData = sensor.getData()
  //     sensorsData.push({
  //       name: sensorData.name,
  //       timestamp: sensorData.timestamp.toString(),
  //       value: sensorData.value
  //     })
  //   }
  
  //   console.log("insertInSensor")
  
  //   /*await getConnection()
  //     .createQueryBuilder()
  //     .insert()
  //     .into(SensorReadings)
  //     .values(sensorsData)
  //     .execute();*/
  // }

}

export default App