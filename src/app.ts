var colors = require('colors');
var express = require('express')
var expressAccessToken = require('express-access-token')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var socketio = require('socket.io')
const mongoose = require('mongoose');

import { Types } from 'mongoose';
import {Scenery, IScenery, SceneryTimers, ISceneryTimers, SceneryActuators, ISceneryActuators } from './model'

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
    this.initMongoose()
    this.setupRoutes()
  }

  

  setupExpress() {
    this.expressApp.use(cookieParser());
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({extended: true}));
    this.expressApp.setMaxListeners(0);
    this.expressServer = this.expressApp.listen(this.config.serverPort, () => { this.onServerStart() });
  }

  firewall = (req:any, res:any, next:any) => {
    const authorized = this.accessTokens.includes(req.accessToken);
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

  async initMongoose() {
    let connection = await mongoose.connect(`${process.env.DB_HOST}${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await this.insertData()
  }

  async insertData() {

    //await Scenery.create({ name: 'notte' });
    // const idTimer = new Types.ObjectId()
    // const timer1 = await SceneryTimers.create({_id: idTimer, name: 'accensione luci sera', timer: '00 20 * * *', active: true})
    
    
    // let sactuators = []

    // let idActuator = new Types.ObjectId()
    // let actuator = SceneryActuators.create({ _id: idActuator, name: '192.168.1.11_luce_giardino', value: "0" });
    // sactuators.push(idActuator)

    // idActuator = new Types.ObjectId()
    // actuator = SceneryActuators.create({ _id: idActuator, name: '192.168.1.11_luce_porta', value: "0" });
    // sactuators.push(idActuator)

    // idActuator = new Types.ObjectId()
    // actuator = SceneryActuators.create({ _id: idActuator,name: '192.168.1.5_main_light', value: "0" });
    // sactuators.push(idActuator)

    // idActuator = new Types.ObjectId()
    // actuator = SceneryActuators.create({ _id: idActuator,name: '192.168.1.10_backyard_main_light', value: "0" });
    // sactuators.push(idActuator)

    // idActuator = new Types.ObjectId()
    // actuator = SceneryActuators.create({ _id: idActuator, name: '192.168.1.10_backyard_door_light', value: "0" });
    // sactuators.push(idActuator)

    // idActuator = new Types.ObjectId()
    // actuator = SceneryActuators.create({ _id: idActuator, name: '192.168.1.9_veranda_main_light', value: "0" });
    // sactuators.push(idActuator)

    // const idScenery = new Types.ObjectId()
    // await Scenery.create({ _id: idScenery, name: 'sera', actuators: sactuators, timers: [idTimer] });


    // const test = await Scenery.find().populate('actuators timers')
    // console.log(test)


    // let sactuators = []

    // let idActuator = new Types.ObjectId()
    // let actuator = SceneryActuators.create({ _id: idActuator, name: '192.168.1.11_luce_giardino', value: "1" });
    // sactuators.push(idActuator)

    // idActuator = new Types.ObjectId()
    // actuator = SceneryActuators.create({ _id: idActuator, name: '192.168.1.11_luce_porta', value: "1" });
    // sactuators.push(idActuator)

    // idActuator = new Types.ObjectId()
    // actuator = SceneryActuators.create({ _id: idActuator, name: '192.168.1.5_main_light', value: "1" });
    // sactuators.push(idActuator)

    // idActuator = new Types.ObjectId()
    // actuator = SceneryActuators.create({ _id: idActuator, name: '192.168.1.9_veranda_main_light', value: "1" });
    // sactuators.push(idActuator)

    // const idScenery = new Types.ObjectId()
    // await Scenery.create({ _id: idScenery, name: 'notte', actuators: sactuators });


    
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
  


}

export default App