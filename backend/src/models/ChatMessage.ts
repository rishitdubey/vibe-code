import mongoose, { Schema } from 'mongoose';
import { IChatMessage } from '../types';

const chatMessageSchema = new Schema<IChatMessage>({
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isAnonymous: {
    type: Boolean,
    default: true
  },
  parentMessage: {
    type: Schema.Types.ObjectId,
    ref: 'ChatMessage',
    default: null
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'ChatMessage'
  }],
  likes: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reply count
chatMessageSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

// Indexes for performance
chatMessageSchema.index({ createdAt: -1 });
chatMessageSchema.index({ parentMessage: 1 });
chatMessageSchema.index({ isAnonymous: 1 });
chatMessageSchema.index({ 'parentMessage': 1, 'createdAt': -1 });

export default mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);