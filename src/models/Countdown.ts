import mongoose, { Schema, Document } from "mongoose";

export interface ICountdown extends Document {
  title: string;
  targetDate: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CountdownSchema = new Schema<ICountdown>(
  {
    title: { type: String, required: true },
    targetDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Countdown ||
  mongoose.model<ICountdown>("Countdown", CountdownSchema);
