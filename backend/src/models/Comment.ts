import mongoose, { Schema } from 'mongoose';
import { IComment } from '../types';

const commentSchema = new Schema<IComment>({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post reference is required']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for performance
commentSchema.index({ post: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ createdAt: -1 });
commentSchema.index({ 'post': 1, 'createdAt': -1 });

export default mongoose.model<IComment>('Comment', commentSchema);