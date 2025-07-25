import { api } from '../api';
import { fetchTodos, createTodo, updateTodo, deleteTodo, updateTodoPosition } from '../api';
import { useEffect, useState } from 'react';

interface Todo {
  _id: string;
  title: string;
  content?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  position: number;
  tags: string[];
}

const TodoComponent = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState({ title: '', content: '', priority: 'medium', dueDate: '', tags: '' });

  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTodos();
      setTodos(data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const todoData = {
        ...newTodo,
        tags: newTodo.tags.split(',').map(t => t.trim()).filter(Boolean),
        dueDate: newTodo.dueDate || undefined
      };
      await createTodo(todoData);
      setNewTodo({ title: '', content: '', priority: 'medium', dueDate: '', tags: '' });
      loadTodos();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create todo');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Todo>) => {
    setLoading(true);
    setError(null);
    try {
      await updateTodo(id, updates);
      loadTodos();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTodo(id);
      loadTodos();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Todos</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleCreate} className="mb-4 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={e => setNewTodo({ ...newTodo, title: e.target.value })}
          required
          className="border p-1 rounded"
        />
        <input
          type="text"
          placeholder="Content"
          value={newTodo.content}
          onChange={e => setNewTodo({ ...newTodo, content: e.target.value })}
          className="border p-1 rounded"
        />
        <select
          value={newTodo.priority}
          onChange={e => setNewTodo({ ...newTodo, priority: e.target.value })}
          className="border p-1 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          value={newTodo.dueDate}
          onChange={e => setNewTodo({ ...newTodo, dueDate: e.target.value })}
          className="border p-1 rounded"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={newTodo.tags}
          onChange={e => setNewTodo({ ...newTodo, tags: e.target.value })}
          className="border p-1 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Add Todo</button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-2">
          {todos.map(todo => (
            <li key={todo._id} className="border p-2 rounded flex items-center justify-between">
              <div>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleUpdate(todo._id, { completed: !todo.completed })}
                  className="mr-2"
                />
                <span className={todo.completed ? 'line-through' : ''}>{todo.title}</span>
                {todo.dueDate && <span className="ml-2 text-xs text-gray-500">Due: {new Date(todo.dueDate).toLocaleDateString()}</span>}
                <span className="ml-2 text-xs text-gray-500">[{todo.priority}]</span>
                {todo.tags.length > 0 && <span className="ml-2 text-xs text-gray-400">Tags: {todo.tags.join(', ')}</span>}
              </div>
              <button onClick={() => handleDelete(todo._id)} className="text-red-500">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoComponent;