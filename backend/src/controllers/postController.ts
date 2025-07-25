import { Response, NextFunction } from 'express';
import Post from '../models/Post';
import Comment from '../models/Comment';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest, ApiResponse } from '../types';
import { parsePaginationQuery, createPaginationResult, getSkipValue } from '../utils/pagination';

export const getPosts = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { page, limit, sort, order } = parsePaginationQuery(req.query);
  const skip = getSkipValue(page, limit);

  // Build sort object
  const sortObj: any = {};
  sortObj[sort] = order === 'asc' ? 1 : -1;

  // Get posts with author information
  const posts = await Post.find()
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
  const total = await Post.countDocuments();

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
    message: 'Posts retrieved successfully',
    data: postsWithInteractions,
    pagination
  };

  res.status(200).json(response);
});

export const createPost = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { content, imageUrl, linkUrl } = req.body;

  const post = await Post.create({
    author: req.user.id,
    content,
    imageUrl,
    linkUrl
  });

  // Populate author information
  await post.populate('author', 'username avatar');

  const response: ApiResponse = {
    status: 'success',
    message: 'Post created successfully',
    data: {
      ...post.toObject(),
      isLiked: false,
      isSaved: false,
      likeCount: 0,
      commentCount: 0,
      saveCount: 0
    }
  };

  res.status(201).json(response);
});

export const updatePost = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;
  const { content, imageUrl, linkUrl } = req.body;

  const post = await Post.findById(id);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check if user is the author or admin
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this post', 403);
  }

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      ...(content && { content }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(linkUrl !== undefined && { linkUrl })
    },
    { new: true, runValidators: true }
  ).populate('author', 'username avatar');

  if (!updatedPost) {
    throw new AppError('Post not found', 404);
  }

  const response: ApiResponse = {
    status: 'success',
    message: 'Post updated successfully',
    data: {
      ...updatedPost.toObject(),
      isLiked: updatedPost.likes.some(like => like.toString() === req.user!.id),
      isSaved: updatedPost.saves.some(save => save.toString() === req.user!.id),
      likeCount: updatedPost.likes.length,
      commentCount: updatedPost.comments.length,
      saveCount: updatedPost.saves.length
    }
  };

  res.status(200).json(response);
});

export const deletePost = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check if user is the author or admin
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this post', 403);
  }

  // Delete all comments associated with the post
  await Comment.deleteMany({ post: id });

  // Delete the post
  await Post.findByIdAndDelete(id);

  const response: ApiResponse = {
    status: 'success',
    message: 'Post deleted successfully'
  };

  res.status(200).json(response);
});

export const toggleLike = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const userIndex = post.likes.indexOf(req.user.id as any);
  let isLiked: boolean;

  if (userIndex > -1) {
    // Unlike
    post.likes.splice(userIndex, 1);
    isLiked = false;
  } else {
    // Like
    post.likes.push(req.user.id as any);
    isLiked = true;
  }

  await post.save();

  const response: ApiResponse = {
    status: 'success',
    message: isLiked ? 'Post liked successfully' : 'Post unliked successfully',
    data: {
      isLiked,
      likeCount: post.likes.length
    }
  };

  res.status(200).json(response);
});

export const toggleSave = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const userIndex = post.saves.indexOf(req.user.id as any);
  let isSaved: boolean;

  if (userIndex > -1) {
    // Unsave
    post.saves.splice(userIndex, 1);
    isSaved = false;
  } else {
    // Save
    post.saves.push(req.user.id as any);
    isSaved = true;
  }

  await post.save();

  const response: ApiResponse = {
    status: 'success',
    message: isSaved ? 'Post saved successfully' : 'Post unsaved successfully',
    data: {
      isSaved,
      saveCount: post.saves.length
    }
  };

  res.status(200).json(response);
});

export const getSavedPosts = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { page, limit, sort, order } = parsePaginationQuery(req.query);
  const skip = getSkipValue(page, limit);

  // Build sort object
  const sortObj: any = {};
  sortObj[sort] = order === 'asc' ? 1 : -1;

  // Get saved posts
  const posts = await Post.find({ saves: req.user.id })
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
  const total = await Post.countDocuments({ saves: req.user.id });

  // Add user interaction flags
  const postsWithInteractions = posts.map(post => ({
    ...post,
    isLiked: post.likes.some(like => like.toString() === req.user!.id),
    isSaved: true, // All posts here are saved
    likeCount: post.likes.length,
    commentCount: post.comments.length,
    saveCount: post.saves.length
  }));

  const pagination = createPaginationResult(page, limit, total);

  const response: ApiResponse = {
    status: 'success',
    message: 'Saved posts retrieved successfully',
    data: postsWithInteractions,
    pagination
  };

  res.status(200).json(response);
});

export const addComment = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;
  const { content } = req.body;

  const post = await Post.findById(id);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const comment = await Comment.create({
    post: id,
    author: req.user.id,
    content
  });

  // Add comment to post
  post.comments.push(comment._id as any);
  await post.save();

  // Populate author information
  await comment.populate('author', 'username avatar');

  const response: ApiResponse = {
    status: 'success',
    message: 'Comment added successfully',
    data: comment
  };

  res.status(201).json(response);
});

export const getComments = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { page, limit, sort, order } = parsePaginationQuery(req.query);
  const skip = getSkipValue(page, limit);

  // Build sort object
  const sortObj: any = {};
  sortObj[sort] = order === 'asc' ? 1 : -1;

  // Check if post exists
  const post = await Post.findById(id);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Get comments
  const comments = await Comment.find({ post: id })
    .populate('author', 'username avatar')
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const total = await Comment.countDocuments({ post: id });

  const pagination = createPaginationResult(page, limit, total);

  const response: ApiResponse = {
    status: 'success',
    message: 'Comments retrieved successfully',
    data: comments,
    pagination
  };

  res.status(200).json(response);
});

export const deleteComment = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;

  const comment = await Comment.findById(id);

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  // Check if user is the author or admin
  if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this comment', 403);
  }

  // Remove comment from post
  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: id }
  });

  // Delete the comment
  await Comment.findByIdAndDelete(id);

  const response: ApiResponse = {
    status: 'success',
    message: 'Comment deleted successfully'
  };

  res.status(200).json(response);
});