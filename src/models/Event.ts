import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  image: string;
  date: Date;
  link?: string;
  type: "drop" | "fashion_show" | "launch" | "other";
  published: boolean;
  notified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: Date, required: true },
    link: String,
    type: {
      type: String,
      enum: ["drop", "fashion_show", "launch", "other"],
      default: "drop",
    },
    published: { type: Boolean, default: false },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Event ||
  mongoose.model<IEvent>("Event", EventSchema);
