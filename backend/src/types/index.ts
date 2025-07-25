import { Request } from 'express';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IPost extends Document {
  _id: string;
  author: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  likes: string[];
  comments: string[];
  saves: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  _id: string;
  post: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessage extends Document {
  _id: string;
  content: string;
  author?: string;
  isAnonymous: boolean;
  parentMessage?: string;
  replies: string[];
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITodo extends Document {
  _id: string;
  user: string;
  title: string;
  content?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  position: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminVerification extends Document {
  _id: string;
  verificationString: string;
  isUsed: boolean;
  createdBy: mongoose.Types.ObjectId | string;
  usedBy?: mongoose.Types.ObjectId | string;
  expiresAt: Date;
  createdAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}