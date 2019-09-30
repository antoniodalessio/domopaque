var express = require('express');
const Gpio = require('onoff').Gpio;
var sensorLib = require('node-dht-sensor');
var app = express();

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
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


app.get('/temp-umidity', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({temperature: temperature, umidity: umidity}));
});

app.listen(3000, function () {
  console.log('Server runnin on port 3000!');
});