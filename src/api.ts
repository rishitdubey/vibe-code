import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/api/v1/auth/user/login', { email, password });
  return response.data;
};

export const registerUser = async (userData: any) => {
  // Map frontend fields to backend expected fields
  const payload = {
    username: userData.name,
    email: userData.email,
    password: userData.password,
    bio: '',
    // Add other fields if needed
  };
  const response = await api.post('/api/v1/auth/user/signup', payload);
  return response.data;
};

export const fetchTodos = async (params = {}) => {
  const response = await api.get('/api/v1/todos', { params });
  return response.data;
};

export const createTodo = async (todoData: any) => {
  const response = await api.post('/api/v1/todos', todoData);
  return response.data;
};

export const updateTodo = async (id: string, todoData: any) => {
  const response = await api.put(`/api/v1/todos/${id}`, todoData);
  return response.data;
};

export const deleteTodo = async (id: string) => {
  const response = await api.delete(`/api/v1/todos/${id}`);
  return response.data;
};

export const updateTodoPosition = async (id: string, position: number) => {
  const response = await api.put(`/api/v1/todos/${id}/position`, { position });
  return response.data;
}; 