import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle, 
  Circle, 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  estimatedHours: number;
  actualHours?: number;
  subtasks: Subtask[];
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export const SyllabusTracker: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Data Structures Assignment 3',
      subject: 'Computer Science',
      dueDate: '2024-01-20',
      priority: 'high',
      status: 'in-progress',
      progress: 60,
      estimatedHours: 8,
      actualHours: 5,
      subtasks: [
        { id: '1a', title: 'Implement Binary Search Tree', completed: true },
        { id: '1b', title: 'Add deletion functionality', completed: true },
        { id: '1c', title: 'Write test cases', completed: false },
        { id: '1d', title: 'Documentation', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Database Project Phase 2',
      subject: 'Database Systems',
      dueDate: '2024-01-25',
      priority: 'medium',
      status: 'pending',
      progress: 20,
      estimatedHours: 12,
      subtasks: [
        { id: '2a', title: 'Design ER diagram', completed: true },
        { id: '2b', title: 'Normalize tables', completed: false },
        { id: '2c', title: 'Implement queries', completed: false },
        { id: '2d', title: 'Create web interface', completed: false }
      ]
    },
    {
      id: '3',
      title: 'Machine Learning Research Paper',
      subject: 'Artificial Intelligence',
      dueDate: '2024-02-01',
      priority: 'high',
      status: 'pending',
      progress: 10,
      estimatedHours: 20,
      subtasks: [
        { id: '3a', title: 'Literature review', completed: false },
        { id: '3b', title: 'Data collection', completed: false },
        { id: '3c', title: 'Model implementation', completed: false },
        { id: '3d', title: 'Results analysis', completed: false },
        { id: '3e', title: 'Write paper', completed: false }
      ]
    }
  ]);

  const filters = ['all', 'pending', 'in-progress', 'completed'];

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'pending' : 
                         task.status === 'pending' ? 'in-progress' : 'completed';
        const newProgress = newStatus === 'completed' ? 100 : 
                           newStatus === 'in-progress' ? Math.max(task.progress, 10) : 0;
        return { ...task, status: newStatus, progress: newProgress };
      }
      return task;
    }));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map(subtask => 
          subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        );
        const completedCount = updatedSubtasks.filter(st => st.completed).length;
        const newProgress = Math.round((completedCount / updatedSubtasks.length) * 100);
        const newStatus = newProgress === 100 ? 'completed' : 
                         newProgress > 0 ? 'in-progress' : 'pending';
        
        return { 
          ...task, 
          subtasks: updatedSubtasks, 
          progress: newProgress,
          status: newStatus
        };
      }
      return task;
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'in-progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'pending': return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = activeFilter === 'all' || task.status === activeFilter;
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Syllabus Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your assignments and study progress
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Overall Progress</h3>
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{overallProgress}%</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{completedTasks}/{totalTasks} tasks</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">This Week</h3>
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Due this week</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Study Time</h3>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">24h</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">This week</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filter.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <button 
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-1"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 hover:text-green-500 transition-colors" />
                  )}
                </button>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>{task.subject}</span>
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Subtasks */}
            <div className="space-y-2">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <button 
                    onClick={() => toggleSubtask(task.id, subtask.id)}
                    className="flex-shrink-0"
                  >
                    {subtask.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400 hover:text-green-500 transition-colors" />
                    )}
                  </button>
                  <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Time Tracking */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span>Estimated: {task.estimatedHours}h</span>
                {task.actualHours && <span>Spent: {task.actualHours}h</span>}
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};