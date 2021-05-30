import { Schema, Document } from 'mongoose';

const sceneryTimers: Schema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  timer: String,
  active: Boolean
})

sceneryTimers.index({'$**': 'text'});

interface ISceneryTimers extends Document {
  name: string,
  timer: string,
  active: boolean,
}

export { 
  sceneryTimers,
  ISceneryTimers
}