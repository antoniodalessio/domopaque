import { Schema, Document } from 'mongoose';
import { SceneryTimers, SceneryActuators, ISceneryTimers, ISceneryActuators} from "./index"

const scenery: Schema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  timers: [{ type: Schema.Types.ObjectId, ref: 'SceneryTimers' }],
  actuators: [{ type: Schema.Types.ObjectId, ref: 'SceneryActuators' }],
})

scenery.index({'$**': 'text'});

interface IScenery extends Document {
  name: string,
  timers: ISceneryTimers[],
  actuators: ISceneryActuators[],
}

export { 
  scenery,
  IScenery
}