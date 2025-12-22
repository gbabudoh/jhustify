import mongoose, { Schema, Document } from 'mongoose';

export interface IBusiness extends Document {
  businessName: string;
  category: string;
  classification: 'REGISTERED' | 'UNREGISTERED';
  contactPersonName: string;
  contactNumber: string;
  email: string;
  physicalAddress: string;
  country: string;
  city?: string;
  geoCoordinates?: {
    lat: number;
    lng: number;
  };
  verificationStatus: 'UNVERIFIED' | 'SUBMITTED' | 'IN_REVIEW' | 'VERIFIED' | 'SUSPENDED' | 'REJECTED';
  verificationTier: 'BASIC' | 'VERIFIED' | 'PREMIUM';
  trustBadgeActive: boolean;
  trustBadgeType?: 'BASIC' | 'GOLD';
  verificationId?: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: mongoose.Types.ObjectId;
}

const BusinessSchema = new Schema<IBusiness>(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    classification: {
      type: String,
      enum: ['REGISTERED', 'UNREGISTERED'],
      required: true,
    },
    contactPersonName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    physicalAddress: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    geoCoordinates: {
      lat: Number,
      lng: Number,
    },
    verificationStatus: {
      type: String,
      enum: ['UNVERIFIED', 'SUBMITTED', 'IN_REVIEW', 'VERIFIED', 'SUSPENDED', 'REJECTED'],
      default: 'UNVERIFIED',
    },
    verificationTier: {
      type: String,
      enum: ['BASIC', 'VERIFIED', 'PREMIUM'],
      default: 'BASIC',
    },
    trustBadgeActive: {
      type: Boolean,
      default: false,
    },
    trustBadgeType: {
      type: String,
      enum: ['BASIC', 'GOLD'],
    },
    verificationId: {
      type: String,
      unique: true,
      sparse: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

BusinessSchema.index({ businessName: 'text', category: 'text', physicalAddress: 'text' });
BusinessSchema.index({ verificationStatus: 1, verificationTier: 1 });
BusinessSchema.index({ geoCoordinates: '2dsphere' });
BusinessSchema.index({ country: 1 });
BusinessSchema.index({ city: 1 });

export default mongoose.models.Business || mongoose.model<IBusiness>('Business', BusinessSchema);

