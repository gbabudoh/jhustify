import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  businessId: mongoose.Types.ObjectId;
  tier: 'BASIC' | 'VERIFIED' | 'PREMIUM';
  status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'PAST_DUE';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  amount: number;
  currency: string;
  paymentMethod?: string;
  paymentGateway?: string;
  paymentGatewaySubscriptionId?: string;
  lastPaymentDate?: Date;
  nextBillingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      unique: true,
    },
    tier: {
      type: String,
      enum: ['BASIC', 'VERIFIED', 'PREMIUM'],
      default: 'BASIC',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'CANCELLED', 'PAST_DUE'],
      default: 'ACTIVE',
    },
    currentPeriodStart: {
      type: Date,
      default: Date.now,
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentMethod: String,
    paymentGateway: String,
    paymentGatewaySubscriptionId: String,
    lastPaymentDate: Date,
    nextBillingDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

SubscriptionSchema.index({ businessId: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ nextBillingDate: 1 });

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

