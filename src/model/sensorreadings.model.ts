import { Schema, Document } from 'mongoose';


const sensorReadings: Schema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  timestamp: String,
  value: String,
})

sensorReadings.index({'$**': 'text'});

interface ISensorReadings extends Document {
  name: string,
  timestamp: string,
  value: string,
}

export { 
  sensorReadings,
  ISensorReadings
}