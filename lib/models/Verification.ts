import mongoose, { Schema, Document } from 'mongoose';

export interface IVerification extends Document {
  verificationId: string;
  businessId: mongoose.Types.ObjectId;
  status: 'SUBMITTED' | 'AUTO_CHECK_PASSED' | 'AUTO_CHECK_FAILED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  classification: 'REGISTERED' | 'UNREGISTERED';
  
  // Document links (stored securely in S3/GCS)
  nationalIdSecureLink?: string;
  registrationDocSecureLink?: string;
  proofOfPresenceVideoLink?: string;
  proofOfPresencePhotos?: string[];
  
  // Geo-tag data
  geoTagData?: {
    lat: number;
    lng: number;
    timestamp: Date;
  };
  
  // Automated check results
  automatedChecks?: {
    contactValidity: boolean;
    idScreening: boolean;
    geoCodeMatch: boolean;
    duplicateCheck: boolean;
  };
  
  // Review notes
  reviewerNotes?: string;
  reviewerId?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  
  // Progress tracking
  progressPercent: number;
  nextStep: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const VerificationSchema = new Schema<IVerification>(
  {
    verificationId: {
      type: String,
      required: true,
      unique: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'AUTO_CHECK_PASSED', 'AUTO_CHECK_FAILED', 'IN_REVIEW', 'APPROVED', 'REJECTED'],
      default: 'SUBMITTED',
    },
    classification: {
      type: String,
      enum: ['REGISTERED', 'UNREGISTERED'],
      required: true,
    },
    nationalIdSecureLink: String,
    registrationDocSecureLink: String,
    proofOfPresenceVideoLink: String,
    proofOfPresencePhotos: [String],
    geoTagData: {
      lat: Number,
      lng: Number,
      timestamp: Date,
    },
    automatedChecks: {
      contactValidity: Boolean,
      idScreening: Boolean,
      geoCodeMatch: Boolean,
      duplicateCheck: Boolean,
    },
    reviewerNotes: String,
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    nextStep: String,
  },
  {
    timestamps: true,
  }
);

VerificationSchema.index({ businessId: 1 });
VerificationSchema.index({ verificationId: 1 });
VerificationSchema.index({ status: 1 });

export default mongoose.models.Verification || mongoose.model<IVerification>('Verification', VerificationSchema);

