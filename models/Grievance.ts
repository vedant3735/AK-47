import mongoose, { Schema, type Document } from "mongoose"

export interface IGrievance extends Document {
  username: string
  text: string
  severity: number
  status: "yet-to-approach" | "in-progress" | "resolved"
  mood?: string
  evidenceUrls?: string[]
  createdAt: Date
  sweetMoment?: {
    text: string
    imageUrl?: string
  }
}

const GrievanceSchema: Schema = new Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  severity: { type: Number, required: true, min: 1, max: 10 },
  status: {
    type: String,
    required: true,
    enum: ["yet-to-approach", "in-progress", "resolved"],
    default: "yet-to-approach",
  },
  mood: { type: String },
  evidenceUrls: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  sweetMoment: {
    text: { type: String },
    imageUrl: { type: String },
  },
})

export default mongoose.models.Grievance || mongoose.model<IGrievance>("Grievance", GrievanceSchema)
