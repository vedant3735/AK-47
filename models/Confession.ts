import mongoose, { Schema, type Document } from "mongoose"

export interface IConfession extends Document {
  text: string
  createdAt: Date
  expiresAt: Date
}

const ConfessionSchema: Schema = new Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // Add an expiresAt field that will be set to 48 hours after creation
  expiresAt: {
    type: Date,
    default: () => {
      const date = new Date()
      date.setHours(date.getHours() + 48) // 48 hours from now
      return date
    },
  },
})

// Create a TTL index on the expiresAt field
// This tells MongoDB to automatically delete documents when expiresAt is reached
ConfessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.Confession || mongoose.model<IConfession>("Confession", ConfessionSchema)
