import mongoose, { Schema, Document } from "mongoose";

export interface IBusiness extends Document {
  businessName: string;
  category: string;
  classification: "REGISTERED" | "UNREGISTERED";
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
  verificationStatus:
    | "UNVERIFIED"
    | "SUBMITTED"
    | "IN_REVIEW"
    | "VERIFIED"
    | "SUSPENDED"
    | "REJECTED";
  verificationTier: "BASIC" | "VERIFIED" | "PREMIUM";
  trustBadgeActive: boolean;
  trustBadgeType?: "INFORMAL" | "FORMAL" | "VERIFIED" | "COMMUNITY_TRUSTED";
  businessRepresentativePhoto?: string;
  mobileVerified: boolean;
  verificationId?: string;
  averageRating?: number;
  ratingCount?: number;

  // Rich Data additions
  socialLinks?: {
    instagram?: string;
    whatsapp?: string;
    facebook?: string;
    linkedin?: string;
  };
  paymentMethods?: ("MOBILE_MONEY" | "BANK_TRANSFER" | "CASH" | "CARD")[];
  yearsInOperation?: number;

  // Formal Sector Rich Data
  taxClearanceStatus?: boolean;
  industryLicenses?: string[];
  employeeCount?: string; // e.g., "1-10", "11-50"
  annualRevenueRange?: string;
  exportReadiness?: boolean;

  // Reputation & Social Impact
  trustScore?: number; // 0-100
  formalizationProgress?: number; // 0-100 (Progress towards becoming formal)
  lastVerifiedAt?: Date;

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
      enum: ["REGISTERED", "UNREGISTERED"],
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
      enum: [
        "UNVERIFIED",
        "SUBMITTED",
        "IN_REVIEW",
        "VERIFIED",
        "SUSPENDED",
        "REJECTED",
      ],
      default: "UNVERIFIED",
    },
    verificationTier: {
      type: String,
      enum: ["BASIC", "VERIFIED", "PREMIUM"],
      default: "BASIC",
    },
    trustBadgeActive: {
      type: Boolean,
      default: false,
    },
    trustBadgeType: {
      type: String,
      enum: ["INFORMAL", "FORMAL", "VERIFIED", "COMMUNITY_TRUSTED"],
    },
    businessRepresentativePhoto: {
      type: String,
    },
    mobileVerified: {
      type: Boolean,
      default: false,
    },
    verificationId: {
      type: String,
      unique: true,
      sparse: true,
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    
    // Rich Data fields
    socialLinks: {
      instagram: String,
      whatsapp: String,
      facebook: String,
      linkedin: String,
    },
    paymentMethods: [{
      type: String,
      enum: ['MOBILE_MONEY', 'BANK_TRANSFER', 'CASH', 'CARD'],
    }],
    yearsInOperation: Number,
    
    // Formal Sector fields
    taxClearanceStatus: {
      type: Boolean,
      default: false,
    },
    industryLicenses: [String],
    employeeCount: String,
    annualRevenueRange: String,
    exportReadiness: {
      type: Boolean,
      default: false,
    },
    
    // Reputation & Social Impact
    trustScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    formalizationProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastVerifiedAt: Date,

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

BusinessSchema.index({
  businessName: "text",
  category: "text",
  physicalAddress: "text",
});
BusinessSchema.index({ verificationStatus: 1, verificationTier: 1 });
BusinessSchema.index({ geoCoordinates: "2dsphere" });
BusinessSchema.index({ country: 1 });
BusinessSchema.index({ city: 1 });

export default mongoose.models.Business ||
  mongoose.model<IBusiness>("Business", BusinessSchema);
