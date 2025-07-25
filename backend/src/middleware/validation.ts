import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/AppError';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      throw new AppError(errorMessage, 400);
    }
    
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      throw new AppError(errorMessage, 400);
    }
    
    next();
  };
};

// Common validation schemas
export const schemas = {
  // Auth schemas
  userSignup: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    bio: Joi.string().max(500).optional()
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  adminSignup: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    verificationString: Joi.string().required(),
    bio: Joi.string().max(500).optional()
  }),

  // Post schemas
  createPost: Joi.object({
    content: Joi.string().max(2000).required(),
    imageUrl: Joi.string().uri().optional(),
    linkUrl: Joi.string().uri().optional()
  }),

  updatePost: Joi.object({
    content: Joi.string().max(2000).optional(),
    imageUrl: Joi.string().uri().optional(),
    linkUrl: Joi.string().uri().optional()
  }),

  // Comment schema
  createComment: Joi.object({
    content: Joi.string().max(500).required()
  }),

  // Chat message schema
  createChatMessage: Joi.object({
    content: Joi.string().max(1000).required(),
    isAnonymous: Joi.boolean().default(true),
    parentMessage: Joi.string().optional()
  }),

  // Todo schemas
  createTodo: Joi.object({
    title: Joi.string().max(200).required(),
    content: Joi.string().max(2000).optional(),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
    dueDate: Joi.date().optional(),
    tags: Joi.array().items(Joi.string().max(50)).optional()
  }),

  updateTodo: Joi.object({
    title: Joi.string().max(200).optional(),
    content: Joi.string().max(2000).optional(),
    completed: Joi.boolean().optional(),
    priority: Joi.string().valid('low', 'medium', 'high').optional(),
    dueDate: Joi.date().optional(),
    tags: Joi.array().items(Joi.string().max(50)).optional()
  }),

  updateTodoPosition: Joi.object({
    position: Joi.number().integer().min(0).required()
  }),

  // Profile update schema
  updateProfile: Joi.object({
    username: Joi.string().min(3).max(30).optional(),
    bio: Joi.string().max(500).optional(),
    avatar: Joi.string().uri().optional()
  }),

  // Pagination schema
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().optional(),
    order: Joi.string().valid('asc', 'desc').default('desc')
  })
};