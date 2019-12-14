var colors = require('colors');
var express = require('express')
import { createConnection, getConnectionOptions, getConnection } from "typeorm";
import { environmentRoutes, googleHomeRoutes, userRoutes, sceneryRoutes } from '@routes'
import HomeController from '@controller/home.controller'

class App {

  _expressApp
  _expressServer
  _config
  _socket
  _mainController

  constructor(config) {
    this.config = config
    this.expressApp = express();
    this.initApp()
  }

  initApp() {
    this.expressApp.use(express.json());
    this.expressApp.setMaxListeners(0);
    this.mainController = new HomeController()//HomeController.getInstance();
    this.mainController.create(this.config.environments)
    this.expressServer = this.expressApp.listen(this.config.serverPort, () => { this.onServerStart() });
    this.setupSocket()
    this.setupRoutes()
    this.initDB()
  }

  setupSocket() {
    const io = require('socket.io')(this.expressServer);
    io.setMaxListeners(0);
    io.on('connection', (s: any) => {
      this.mainController.socket = s;
      s.emit('connection init');
      s.on("client response", (res) => {
        console.log(res)
      })
    });
  }

  setupRoutes() {
    this.expressApp.use('/api/home/', environmentRoutes(this.mainController));
    this.expressApp.use('/api/googlehome/', googleHomeRoutes())
    this.expressApp.use('/api/user/', userRoutes())
    this.expressApp.use('/api/scenery/', sceneryRoutes(this.mainController))
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