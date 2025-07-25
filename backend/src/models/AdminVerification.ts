import mongoose, { Schema } from 'mongoose';
import { IAdminVerification } from '../types';

const adminVerificationSchema = new Schema({
  verificationString: {
    type: String,
    required: [true, 'Verification string is required'],
    unique: true,
    index: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator reference is required']
  },
  usedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  }
}, {
  timestamps: true
});

// TTL index for automatic cleanup
adminVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Indexes for performance
adminVerificationSchema.index({ verificationString: 1 });
adminVerificationSchema.index({ isUsed: 1 });
adminVerificationSchema.index({ createdBy: 1 });

export default mongoose.model<IAdminVerification>('AdminVerification', adminVerificationSchema);