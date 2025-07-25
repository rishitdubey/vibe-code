import { Response, NextFunction } from 'express';
import Todo from '../models/Todo';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest, ApiResponse } from '../types';
import { parsePaginationQuery, createPaginationResult, getSkipValue } from '../utils/pagination';

export const getTodos = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { page, limit, sort, order } = parsePaginationQuery(req.query);
  const skip = getSkipValue(page, limit);

  // Build filter
  const filter: any = { user: req.user.id };
  
  // Add completed filter if specified
  if (req.query.completed !== undefined) {
    filter.completed = req.query.completed === 'true';
  }

  // Add priority filter if specified
  if (req.query.priority) {
    filter.priority = req.query.priority;
  }

  // Add due date filter if specified
  if (req.query.dueBefore) {
    filter.dueDate = { $lte: new Date(req.query.dueBefore as string) };
  }

  // Build sort object - default to position for user's todos
  const sortObj: any = {};
  if (sort === 'position') {
    sortObj.position = order === 'desc' ? -1 : 1;
  } else {
    sortObj[sort] = order === 'asc' ? 1 : -1;
  }

  // Get todos
  const todos = await Todo.find(filter)
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const total = await Todo.countDocuments(filter);

  const pagination = createPaginationResult(page, limit, total);

  const response: ApiResponse = {
    status: 'success',
    message: 'Todos retrieved successfully',
    data: todos,
    pagination
  };

  res.status(200).json(response);
});

export const createTodo = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { title, content, priority, dueDate, tags } = req.body;

  // Get the highest position for this user to append new todo at the end
  const lastTodo = await Todo.findOne({ user: req.user.id }).sort({ position: -1 });
  const position = lastTodo ? lastTodo.position + 1 : 0;

  const todo = await Todo.create({
    user: req.user.id,
    title,
    content: content || '',
    priority: priority || 'medium',
    dueDate: dueDate ? new Date(dueDate) : null,
    tags: tags || [],
    position
  });

  const response: ApiResponse = {
    status: 'success',
    message: 'Todo created successfully',
    data: todo
  };

  res.status(201).json(response);
});

export const updateTodo = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;
  const { title, content, completed, priority, dueDate, tags } = req.body;

  const todo = await Todo.findOne({ _id: id, user: req.user.id });

  if (!todo) {
    throw new AppError('Todo not found', 404);
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(completed !== undefined && { completed }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      ...(tags !== undefined && { tags })
    },
    { new: true, runValidators: true }
  );

  const response: ApiResponse = {
    status: 'success',
    message: 'Todo updated successfully',
    data: updatedTodo
  };

  res.status(200).json(response);
});

export const deleteTodo = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;

  const todo = await Todo.findOne({ _id: id, user: req.user.id });

  if (!todo) {
    throw new AppError('Todo not found', 404);
  }

  // Update positions of todos that come after this one
  await Todo.updateMany(
    { user: req.user.id, position: { $gt: todo.position } },
    { $inc: { position: -1 } }
  );

  await Todo.findByIdAndDelete(id);

  const response: ApiResponse = {
    status: 'success',
    message: 'Todo deleted successfully'
  };

  res.status(200).json(response);
});

export const updateTodoPosition = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;
  const { position } = req.body;

  const todo = await Todo.findOne({ _id: id, user: req.user.id });

  if (!todo) {
    throw new AppError('Todo not found', 404);
  }

  const oldPosition = todo.position;
  const newPosition = position;

  if (oldPosition === newPosition) {
    const response: ApiResponse = {
      status: 'success',
      message: 'Todo position unchanged',
      data: todo
    };
    return res.status(200).json(response);
  }

  // Update positions of other todos
  if (newPosition > oldPosition) {
    // Moving down: decrease position of todos between old and new position
    await Todo.updateMany(
      {
        user: req.user.id,
        position: { $gt: oldPosition, $lte: newPosition }
      },
      { $inc: { position: -1 } }
    );
  } else {
    // Moving up: increase position of todos between new and old position
    await Todo.updateMany(
      {
        user: req.user.id,
        position: { $gte: newPosition, $lt: oldPosition }
      },
      { $inc: { position: 1 } }
    );
  }

  // Update the todo's position
  todo.position = newPosition;
  await todo.save();

  const response: ApiResponse = {
    status: 'success',
    message: 'Todo position updated successfully',
    data: todo
  };

  res.status(200).json(response);
});

export const getTodoStats = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  // Get various statistics
  const [
    totalTodos,
    completedTodos,
    pendingTodos,
    overdueTodos,
    todayTodos,
    priorityStats
  ] = await Promise.all([
    Todo.countDocuments({ user: req.user.id }),
    Todo.countDocuments({ user: req.user.id, completed: true }),
    Todo.countDocuments({ user: req.user.id, completed: false }),
    Todo.countDocuments({
      user: req.user.id,
      completed: false,
      dueDate: { $lt: new Date() }
    }),
    Todo.countDocuments({
      user: req.user.id,
      completed: false,
      dueDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    }),
    Todo.aggregate([
      { $match: { user: req.user.id, completed: false } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ])
  ]);

  const priorityBreakdown = {
    high: 0,
    medium: 0,
    low: 0
  };

  priorityStats.forEach((stat: any) => {
    priorityBreakdown[stat._id as keyof typeof priorityBreakdown] = stat.count;
  });

  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const response: ApiResponse = {
    status: 'success',
    message: 'Todo statistics retrieved successfully',
    data: {
      totalTodos,
      completedTodos,
      pendingTodos,
      overdueTodos,
      todayTodos,
      completionRate,
      priorityBreakdown
    }
  };

  res.status(200).json(response);
});

export const bulkUpdateTodos = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { todoIds, updates } = req.body;

  if (!Array.isArray(todoIds) || todoIds.length === 0) {
    throw new AppError('Todo IDs array is required', 400);
  }

  if (!updates || Object.keys(updates).length === 0) {
    throw new AppError('Updates object is required', 400);
  }

  // Validate that all todos belong to the user
  const userTodos = await Todo.find({
    _id: { $in: todoIds },
    user: req.user.id
  });

  if (userTodos.length !== todoIds.length) {
    throw new AppError('Some todos not found or not authorized', 404);
  }

  // Perform bulk update
  const result = await Todo.updateMany(
    { _id: { $in: todoIds }, user: req.user.id },
    updates,
    { runValidators: true }
  );

  const response: ApiResponse = {
    status: 'success',
    message: `${result.modifiedCount} todos updated successfully`,
    data: {
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    }
  };

  res.status(200).json(response);
});