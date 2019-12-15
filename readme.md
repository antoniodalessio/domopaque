# An experimental building automation framework based on Raspberry PI and nodemcu(ESP8266) in nodejs server.

A device that makes decisions is usually called a controller. Its biological equivalent is a brain. The devices that collect information are called sensors, which are equivalent to the senses. The devices that act to control the equipment are called actuators, which are equivalent to muscles. The information from the sensors to the controller and from the controller to the actuators travel over communication channels, which are usually wires but can be fiber optics, radio signals or complex networks. Such communication channels are equivalent to the nerves.

The sensors and actuators can sometimes be embedded in the controller. An example of a simple controller with embedded sensor and actuator is a bimetallic room thermostat. It senses the room temperature, compares it against what the occupants set as comfortable, and then switches On and Off heating or cooling equipment to maintain the temperature acceptable without damaging or wearing unnecessarily the equipment. A more sophisticated thermostat would also keep track of time and detect if the room is occupied to then use different setpoints, and even sense and control humidity.

## How it works?
Most of devices are implements on nodemcu esp while for server has been used raspberry PI.
When the server starts, ping devices ip readed in the configuration files and devices reply with information to server about its sensors and actuators. If any device doesn't responding, server act fault tolerance and doesn't crash.

Example
```json
{
  "environments": [
    {
      "name": "soggiorno",
      "color": "green",
      "ips": [
        "192.168.1.5"
      ],
      "devices": [
        {
          "name": "soggiorno_192.168.1.5",
          "ip": "192.168.1.5",
          "type": "",
          "sensors": [
            {
              "name": "soggiorno_192.168.1.5_temperature",
              "type": "temperature",
              "value": "19.00",
              "timestamp": 1572442148279
            },
            {
              "name": "soggiorno_192.168.1.5_umidity",
              "type": "umidity",
              "value": "90.00",
              "timestamp": 1572442148279
            }
          ],
          "actuators": [
            {
              "name": "192.168.1.5_main_light",
              "value": 0,
              "type": "rele",
              "timestamp": 1572442148279
            }
          ]
        }
      ],
      "inside": true
    },
    {
      "name": "veranda",
      "color": "purple",
      "ips": [
        "192.168.1.10"
      ],
      "devices": [
        {
          "name": "veranda_192.168.1.10",
          "ip": "192.168.1.10",
          "type": "",
          "sensors": [
            {
              "name": "veranda_192.168.1.10_temperature",
              "type": "temperature",
              "value": "20.90",
              "timestamp": 1572442165304
            },
            {
              "name": "veranda_192.168.1.10_lightSensor",
              "type": "lightSensor",
              "value": "0",
              "timestamp": 1572442165304
            },
            {
              "name": "veranda_192.168.1.10_umidity",
              "type": "umidity",
              "value": "83.00",
              "timestamp": 1572442165304
            },
            {
              "name": "veranda_192.168.1.10_raindrop",
              "type": "raindrop",
              "value": "very_dry_not_raining",
              "timestamp": 1572442165304
            }
          ],
          "actuators": []
        }
      ],
      "inside": false
    },
    {
      "name": "corridoio_piano_primo",
      "color": "yellow",
      "ips": [
        "192.168.1.11"
      ],
      "devices": [
        {
          "name": "corridoio_piano_primo_192.168.1.11",
          "ip": "192.168.1.11",
          "type": "",
          "sensors": [],
          "actuators": [],
          "error": {
            "msg": "device doesn't responding: 192.168.1.11 over 4 seconds",
            "code": 404
          }
        }
      ],
      "inside": true
    }
  ]
}
```


![Backyard1](https://github.com/antoniodalessio/domopaque/blob/develop/src/assets/backyard4.jpeg)
![Backyard1](https://github.com/antoniodalessio/domopaque/blob/develop/src/assets/backyard1.jpeg)
![Backyard1](https://github.com/antoniodalessio/domopaque/blob/develop/src/assets/backyard2.jpeg)
![Backyard1](https://github.com/antoniodalessio/domopaque/blob/develop/src/assets/backyard3.jpeg)
