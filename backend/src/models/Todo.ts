import mongoose, { Schema } from 'mongoose';
import { ITodo } from '../types';

const todoSchema = new Schema<ITodo>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  title: {
    type: String,
    required: [true, 'Todo title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    maxlength: [2000, 'Content cannot exceed 2000 characters'],
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    default: null
  },
  position: {
    type: Number,
    required: true,
    default: 0
  },
  tags: [{
    type: String,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }]
}, {
  timestamps: true
});

// Indexes for performance
todoSchema.index({ user: 1 });
todoSchema.index({ completed: 1 });
todoSchema.index({ dueDate: 1 });
todoSchema.index({ priority: 1 });
todoSchema.index({ 'user': 1, 'position': 1 });
todoSchema.index({ 'user': 1, 'completed': 1, 'position': 1 });

export default mongoose.model<ITodo>('Todo', todoSchema);