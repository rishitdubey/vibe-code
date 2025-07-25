import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import AdminVerification from '../models/AdminVerification';
import { AppError } from '../utils/AppError';
import { generateTokens } from '../utils/jwt';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest, ApiResponse } from '../types';

export const userSignup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, bio } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new AppError('User with this email or username already exists', 400);
  }

  // Create new user
  const user = await User.create({
    username,
    email,
    password,
    bio: bio || '',
    role: 'user'
  });

  // Generate tokens
  const tokens = generateTokens({
    id: user._id,
    email: user.email,
    role: user.role
  });

  const response: ApiResponse = {
    status: 'success',
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      },
      tokens
    }
  };

  res.status(201).json(response);
});

export const userLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
  const tokens = generateTokens({
    id: user._id,
    email: user.email,
    role: user.role
  });

  const response: ApiResponse = {
    status: 'success',
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      },
      tokens
    }
  };

  res.status(200).json(response);
});

export const adminSignup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, verificationString, bio } = req.body;

  // Verify the verification string
  const verification = await AdminVerification.findOne({
    verificationString,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  });

  if (!verification) {
    throw new AppError('Invalid or expired verification string', 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new AppError('User with this email or username already exists', 400);
  }

  // Create new admin user
  const user = await User.create({
    username,
    email,
    password,
    bio: bio || '',
    role: 'admin',
    isVerified: true
  });

  // Mark verification string as used
  verification.isUsed = true;
  verification.usedBy = user._id;
  await verification.save();

  // Generate tokens
  const tokens = generateTokens({
    id: user._id,
    email: user.email,
    role: user.role
  });

  const response: ApiResponse = {
    status: 'success',
    message: 'Admin registered successfully',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      },
      tokens
    }
  };

  res.status(201).json(response);
});

export const adminLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Find admin user and include password
  const user = await User.findOne({ email, role: 'admin' }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid admin credentials', 401);
  }

  // Generate tokens
  const tokens = generateTokens({
    id: user._id,
    email: user.email,
    role: user.role
  });

  const response: ApiResponse = {
    status: 'success',
    message: 'Admin login successful',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      },
      tokens
    }
  };

  res.status(200).json(response);
});

export const generateAdminVerification = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Only existing admins can generate verification strings
  if (!req.user || req.user.role !== 'admin') {
    throw new AppError('Only admins can generate verification strings', 403);
  }

  const verificationString = uuidv4();

  const verification = await AdminVerification.create({
    verificationString,
    createdBy: req.user.id,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  });

  const response: ApiResponse = {
    status: 'success',
    message: 'Admin verification string generated successfully',
    data: {
      verificationString: verification.verificationString,
      expiresAt: verification.expiresAt
    }
  };

  res.status(201).json(response);
});

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const response: ApiResponse = {
    status: 'success',
    message: 'Profile retrieved successfully',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  };

  res.status(200).json(response);
});

export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { username, bio, avatar } = req.body;

  // Check if username is already taken by another user
  if (username) {
    const existingUser = await User.findOne({
      username,
      _id: { $ne: req.user.id }
    });

    if (existingUser) {
      throw new AppError('Username is already taken', 400);
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      ...(username && { username }),
      ...(bio !== undefined && { bio }),
      ...(avatar && { avatar })
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const response: ApiResponse = {
    status: 'success',
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  };

  res.status(200).json(response);
});