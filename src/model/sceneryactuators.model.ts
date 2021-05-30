import { Schema, Document } from 'mongoose';


const sceneryActuators: Schema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  value: String,
})

sceneryActuators.index({'$**': 'text'});

interface ISceneryActuators extends Document {
  name: string,
  value: string
}

export { 
  sceneryActuators,
  ISceneryActuators
}