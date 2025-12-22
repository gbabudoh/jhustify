import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  position: 'MAIN_LEFT' | 'TOP_RIGHT' | 'MIDDLE_RIGHT' | 'BOTTOM_RIGHT';
  costPrice: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  clickCount: number;
  impressionCount: number;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Banner title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Banner image URL is required'],
    },
    linkUrl: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      enum: ['MAIN_LEFT', 'TOP_RIGHT', 'MIDDLE_RIGHT', 'BOTTOM_RIGHT'],
      required: [true, 'Banner position is required'],
    },
    costPrice: {
      type: Number,
      required: [true, 'Cost price is required'],
      min: [0, 'Cost price cannot be negative'],
      default: 0,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (this: IBanner, value: Date) {
          return value > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    clickCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    impressionCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying of active banners
BannerSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
BannerSchema.index({ position: 1, isActive: 1 });

// Method to check if banner is currently valid
BannerSchema.methods.isCurrentlyActive = function () {
  const now = new Date();
  return this.isActive && this.startDate <= now && this.endDate >= now;
};

// Static method to get active banners for display
BannerSchema.statics.getActiveBanners = async function () {
  const now = new Date();
  return this.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).sort({ position: 1, createdAt: -1 });
};

export default mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);
