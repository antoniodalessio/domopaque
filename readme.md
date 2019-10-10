# An experimental building automation framework based on Raspberry PI and Arduino, nodemcu in nodejs server.

A device that makes decisions is usually called a controller. Its biological equivalent is a brain. The devices that collect information are called sensors, which are equivalent to the senses. The devices that act to control the equipment are called actuators, which are equivalent to muscles. The information from the sensors to the controller and from the controller to the actuators travel over communication channels, which are usually wires but can be fiber optics, radio signals or complex networks. Such communication channels are equivalent to the nerves.

The sensors and actuators can sometimes be embedded in the controller. An example of a simple controller with embedded sensor and actuator is a bimetallic room thermostat. It senses the room temperature, compares it against what the occupants set as comfortable, and then switches On and Off heating or cooling equipment to maintain the temperature acceptable without damaging or wearing unnecessarily the equipment. A more sophisticated thermostat would also keep track of time and detect if the room is occupied to then use different setpoints, and even sense and control humidity.

## How it work?
Most of devices are implements on nodemcu esp while for server a raspberry PI.
When the server starts, ping devices ip readed in the configuration files and devices reply with information to server about its sensors and actuators. If any device doesn't responding, server act fault tolerance and doesn't crash.
