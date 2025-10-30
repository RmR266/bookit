import mongoose, { Schema, Document } from 'mongoose';

export interface ISlot {
  date: string;        // ISO date or date-string
  time: string;        // e.g. "10:00"
  capacity: number;
  booked: number;
}

export interface IExperience extends Document {
  title: string;
  description: string;
  price: number;
  images: string[];
  slots: ISlot[];
}

const SlotSchema: Schema = new Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  capacity: { type: Number, required: true },
  booked: { type: Number, default: 0 }
});

const ExperienceSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  images: [String],
  slots: [SlotSchema]
});

export default mongoose.model<IExperience>('Experience', ExperienceSchema);