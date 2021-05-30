import { model } from 'mongoose';

import { scenery, IScenery } from './scenery.model'
import { sceneryActuators, ISceneryActuators } from './sceneryactuators.model'
import { sceneryTimers, ISceneryTimers } from './scenerytimers.model'
import { sensorReadings, ISensorReadings } from './sensorreadings.model'

let Scenery = model<IScenery>('Scenery', scenery)
let SceneryActuators = model<ISceneryActuators>('SceneryActuators', sceneryActuators)
let SceneryTimers = model<ISceneryTimers>('SceneryTimers', sceneryTimers)
let SensorReadings = model<ISensorReadings>('SensorReadings', sensorReadings)

export {
    Scenery,
    IScenery,
    SceneryActuators,
    ISceneryActuators,
    SceneryTimers,
    ISceneryTimers,
    SensorReadings,
    ISensorReadings,
}