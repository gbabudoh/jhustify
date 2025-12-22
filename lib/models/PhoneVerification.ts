import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoneVerification extends Document {
  phoneNumber: string;
  code: string;
  businessId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  verified: boolean;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const PhoneVerificationSchema = new Schema<IPhoneVerification>(
  {
    phoneNumber: {
      type: String,
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // Auto-delete expired documents
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5, // Max 5 attempts
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
PhoneVerificationSchema.index({ phoneNumber: 1, verified: 1 });
PhoneVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.PhoneVerification || mongoose.model<IPhoneVerification>('PhoneVerification', PhoneVerificationSchema);

