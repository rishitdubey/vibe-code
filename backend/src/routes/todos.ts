import { Router } from 'express';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  updateTodoPosition,
  getTodoStats,
  bulkUpdateTodos
} from '../controllers/todoController';
import { authenticate } from '../middleware/auth';
import { validate, validateQuery, schemas } from '../middleware/validation';

const router = Router();

// All todo routes require authentication
router.use(authenticate);

// Todo CRUD routes
router.get('/', validateQuery(schemas.pagination), getTodos);
router.post('/', validate(schemas.createTodo), createTodo);
router.put('/:id', validate(schemas.updateTodo), updateTodo);
router.delete('/:id', deleteTodo);

// Todo position management
router.put('/:id/position', validate(schemas.updateTodoPosition), updateTodoPosition);

// Todo statistics
router.get('/stats', getTodoStats);

// Bulk operations
router.patch('/bulk', bulkUpdateTodos);

export default router;