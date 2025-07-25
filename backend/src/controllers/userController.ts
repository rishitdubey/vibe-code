import { Response, NextFunction } from 'express';
import User from '../models/User';
import Post from '../models/Post';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest, ApiResponse } from '../types';
import { parsePaginationQuery, createPaginationResult, getSkipValue } from '../utils/pagination';

export const getUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  const { page, limit, sort, order } = parsePaginationQuery(req.query);
  const skip = getSkipValue(page, limit);

  // Build filter
  const filter: any = {};
  
  // Add role filter if specified
  if (req.query.role) {
    filter.role = req.query.role;
  }

  // Add search filter if specified
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search as string, 'i');
    filter.$or = [
      { username: searchRegex },
      { email: searchRegex }
    ];
  }

  // Build sort object
  const sortObj: any = {};
  sortObj[sort] = order === 'asc' ? 1 : -1;

  // Get users
  const users = await User.find(filter)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .select('-password');

  // Get total count for pagination
  const total = await User.countDocuments(filter);

  const pagination = createPaginationResult(page, limit, total);

  const response: ApiResponse = {
    status: 'success',
    message: 'Users retrieved successfully',
    data: users,
    pagination
  };

  res.status(200).json(response);
});

export const getUserById = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await User.findById(id).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Get user's post count
  const postCount = await Post.countDocuments({ author: id });

  const response: ApiResponse = {
    status: 'success',
    message: 'User retrieved successfully',
    data: {
      ...user.toObject(),
      postCount
    }
  };

  res.status(200).json(response);
});

export const getUserPosts = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { page, limit, sort, order } = parsePaginationQuery(req.query);
  const skip = getSkipValue(page, limit);

  // Check if user exists
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Build sort object
  const sortObj: any = {};
  sortObj[sort] = order === 'asc' ? 1 : -1;

  // Get user's posts
  const posts = await Post.find({ author: id })
    .populate('author', 'username avatar')
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'username avatar'
      },
      options: { limit: 3, sort: { createdAt: -1 } }
    })
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .lean();

  // Get total count for pagination
  const total = await Post.countDocuments({ author: id });

  // Add user interaction flags if authenticated
  const postsWithInteractions = posts.map(post => ({
    ...post,
    isLiked: req.user ? post.likes.some(like => like.toString() === req.user!.id) : false,
    isSaved: req.user ? post.saves.some(save => save.toString() === req.user!.id) : false,
    likeCount: post.likes.length,
    commentCount: post.comments.length,
    saveCount: post.saves.length
  }));

  const pagination = createPaginationResult(page, limit, total);

  const response: ApiResponse = {
    status: 'success',
    message: 'User posts retrieved successfully',
    data: postsWithInteractions,
    pagination
  };

  res.status(200).json(response);
});

export const updateUserRole = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    throw new AppError('Invalid role specified', 400);
  }

  // Prevent admin from changing their own role
  if (id === req.user.id) {
    throw new AppError('Cannot change your own role', 400);
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const response: ApiResponse = {
    status: 'success',
    message: 'User role updated successfully',
    data: user
  };

  res.status(200).json(response);
});

export const toggleUserStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  const { id } = req.params;

  // Prevent admin from deactivating themselves
  if (id === req.user.id) {
    throw new AppError('Cannot change your own status', 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.isVerified = !user.isVerified;
  await user.save();

  const response: ApiResponse = {
    status: 'success',
    message: `User ${user.isVerified ? 'activated' : 'deactivated'} successfully`,
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified
    }
  };

  res.status(200).json(response);
});

export const deleteUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  const { id } = req.params;

  // Prevent admin from deleting themselves
  if (id === req.user.id) {
    throw new AppError('Cannot delete your own account', 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Delete user's posts and related data
  await Post.deleteMany({ author: id });

  // Delete the user
  await User.findByIdAndDelete(id);

  const response: ApiResponse = {
    status: 'success',
    message: 'User deleted successfully'
  };

  res.status(200).json(response);
});

export const getUserStats = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  const [
    totalUsers,
    activeUsers,
    adminUsers,
    totalPosts,
    recentUsers
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isVerified: true }),
    User.countDocuments({ role: 'admin' }),
    Post.countDocuments(),
    User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    })
  ]);

  // Get user registration trend for the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const registrationTrend = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  const response: ApiResponse = {
    status: 'success',
    message: 'User statistics retrieved successfully',
    data: {
      totalUsers,
      activeUsers,
      adminUsers,
      totalPosts,
      recentUsers,
      registrationTrend
    }
  };

  res.status(200).json(response);
});