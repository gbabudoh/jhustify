import mongoose, { Schema, Document } from 'mongoose';

export interface IRating extends Document {
  businessId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Consumer who rated
  rating: number; // 1-5 stars
  comment?: string;
  verified: boolean; // Whether the consumer has actually done business with them
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
    verified: {
      type: Boolean,
      default: false, // Can be set to true if they've sent messages or done business
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one rating per user per business
RatingSchema.index({ businessId: 1, userId: 1 }, { unique: true });
RatingSchema.index({ businessId: 1, rating: 1 });
RatingSchema.index({ createdAt: -1 });

export default mongoose.models.Rating || mongoose.model<IRating>('Rating', RatingSchema);

