import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
  image: string;
  title: string;
  subtitle?: string;
  link?: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: String,
    link: String,
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Banner ||
  mongoose.model<IBanner>("Banner", BannerSchema);
