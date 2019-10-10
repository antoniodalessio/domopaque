# An experimental building automation framework based on Raspberry PI and nodemcu in nodejs server.

A device that makes decisions is usually called a controller. Its biological equivalent is a brain. The devices that collect information are called sensors, which are equivalent to the senses. The devices that act to control the equipment are called actuators, which are equivalent to muscles. The information from the sensors to the controller and from the controller to the actuators travel over communication channels, which are usually wires but can be fiber optics, radio signals or complex networks. Such communication channels are equivalent to the nerves.

The sensors and actuators can sometimes be embedded in the controller. An example of a simple controller with embedded sensor and actuator is a bimetallic room thermostat. It senses the room temperature, compares it against what the occupants set as comfortable, and then switches On and Off heating or cooling equipment to maintain the temperature acceptable without damaging or wearing unnecessarily the equipment. A more sophisticated thermostat would also keep track of time and detect if the room is occupied to then use different setpoints, and even sense and control humidity.

## How it works?
Most of devices are implements on nodemcu esp while for server has been used raspberry PI.
When the server starts, ping devices ip readed in the configuration files and devices reply with information to server about its sensors and actuators. If any device doesn't responding, server act fault tolerance and doesn't crash.

Example

{
    "environments": [
        {
            "name": "soggiorno",
            "color": "green",
            "type": "master",
            "ips": "",
            "devices": [
                {
                    "name": "raspberry",
                    "sensors": [
                        {
                            "name": "temperature",
                            "type": "temperature",
                            "value": 21,
                            "timestamp": 1570715032950
                        },
                        {
                            "name": "umidity",
                            "type": "umidity",
                            "value": 74,
                            "timestamp": 1570715032950
                        }
                    ]
                }
            ]
        },
        {
            "name": "veranda",
            "color": "purple",
            "type": "slave",
            "ips": [
                "192.168.1.10"
            ],
            "devices": [
                {
                    "name": "veranda_192.168.1.10",
                    "ip": "192.168.1.10",
                    "sensors": [
                        {
                            "name": "veranda_192.168.1.10_temperature",
                            "type": "temperature",
                            "value": "23.70",
                            "timestamp": 1570719554557
                        },
                        {
                            "name": "veranda_192.168.1.10_umidity",
                            "type": "umidity",
                            "value": "51.00",
                            "timestamp": 1570719554558
                        }
                    ]
                }
            ]
        },
        {
            "name": "corridoio_piano_secondo",
            "color": "yellow",
            "type": "slave",
            "ips": [
                "192.168.1.11"
            ],
            "devices": [
                {
                    "name": "corridoio_piano_secondo_192.168.1.11",
                    "ip": "192.168.1.11",
                    "sensors": [
                        {
                            "name": "corridoio_piano_secondo_192.168.1.11_temperature",
                            "type": "temperature",
                            "value": "19.90",
                            "timestamp": 1570715050487
                        },
                        {
                            "name": "corridoio_piano_secondo_192.168.1.11_umidity",
                            "type": "umidity",
                            "value": "76.00",
                            "timestamp": 1570715050487
                        }
                    ]
                }
            ]
        }
    ]
}
