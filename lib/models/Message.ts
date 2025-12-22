import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  businessId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId; // Consumer user ID (if authenticated)
  fromEmail: string;
  fromName: string;
  fromPhone?: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
  readAt?: Date;
  repliedAt?: Date;
  replyMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for backward compatibility
    },
    fromEmail: {
      type: String,
      required: true,
    },
    fromName: {
      type: String,
      required: true,
    },
    fromPhone: String,
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['UNREAD', 'READ', 'REPLIED', 'ARCHIVED'],
      default: 'UNREAD',
    },
    readAt: Date,
    repliedAt: Date,
    replyMessage: String,
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ businessId: 1, status: 1 });
MessageSchema.index({ userId: 1, createdAt: -1 });
MessageSchema.index({ createdAt: -1 });

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

