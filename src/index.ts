var express = require('express');
var sensorLib = require('node-dht-sensor');
const axios = require('axios');


import GoogleHomeController from './controller/GoogleHome.controller'

var app = express();

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});

var GH = new GoogleHomeController();

app.get('/google-home/:msg', function (req, res) {
  GH.speak(req.params.msg)
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({msg: req.params.msg}));
});


var temperature = 0;
var umidity = 0;


var sensorType = 11;
var sensorPin  = 4;
if (!sensorLib.initialize(sensorType, sensorPin)) {
    console.warn('Failed to initialize sensor');
    process.exit(1);
}


// Automatically update sensor value every 2 seconds
setInterval(function() {
    var readout = sensorLib.read();
    
    temperature = readout.temperature;
    umidity = readout.humidity.toFixed(1)
    
    console.log('Temperature:', temperature + 'C');
    console.log('Humidity:   ', umidity    + '%');
}, 2000);


app.get('/temp-umidity', async function (req, res) {

  let dataVeranda = await axios.get('http://192.168.1.10:3005/ping')

  let data = {
    veranda: dataVeranda,
    soggiorno: {
      temperature: temperature,
      umidity: umidity
    }
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(data));
});