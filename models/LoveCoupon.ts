import mongoose, { Schema, type Document } from "mongoose"

export interface ILoveCoupon extends Document {
  title: string
  description: string
  imageUrl?: string
  isRedeemed: boolean
  createdAt: Date
}

const LoveCouponSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  isRedeemed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.LoveCoupon || mongoose.model<ILoveCoupon>("LoveCoupon", LoveCouponSchema)
