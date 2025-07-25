import React, { useState } from 'react';
import { 
  MessageCircle, 
  Plus, 
  Search, 
  Filter, 
  Heart, 
  Reply, 
  Shield,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { api } from '../api';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: 'academic' | 'personal' | 'career' | 'health';
  author: 'Anonymous' | 'Counselor' | 'Peer';
  timestamp: string;
  replies: number;
  likes: number;
  isResolved: boolean;
  isUrgent: boolean;
  tags: string[];
}

export const SupportForum: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const categories = [
    { id: 'all', label: 'All Posts', color: 'gray' },
    { id: 'academic', label: 'Academic Stress', color: 'blue' },
    { id: 'personal', label: 'Personal Issues', color: 'purple' },
    { id: 'career', label: 'Career Guidance', color: 'green' },
    { id: 'health', label: 'Mental Health', color: 'red' }
  ];

  const posts: ForumPost[] = [
    {
      id: '1',
      title: 'Struggling with exam anxiety - need advice',
      content: 'I have my finals coming up in 2 weeks and I\'m feeling overwhelmed. The pressure is affecting my sleep and concentration. Has anyone experienced this?',
      category: 'academic',
      author: 'Anonymous',
      timestamp: '2 hours ago',
      replies: 12,
      likes: 8,
      isResolved: false,
      isUrgent: true,
      tags: ['anxiety', 'exams', 'stress']
    },
    {
      id: '2',
      title: 'Career transition advice needed',
      content: 'I\'m in my final year of CS but considering switching to product management. Would love to hear from anyone who made a similar transition.',
      category: 'career',
      author: 'Anonymous',
      timestamp: '5 hours ago',
      replies: 7,
      likes: 15,
      isResolved: true,
      isUrgent: false,
      tags: ['career-change', 'product-management', 'cs']
    },
    {
      id: '3',
      title: 'Healthy study habits for better focus',
      content: 'As a counselor, I wanted to share some evidence-based techniques for maintaining focus during long study sessions.',
      category: 'academic',
      author: 'Counselor',
      timestamp: '1 day ago',
      replies: 23,
      likes: 45,
      isResolved: false,
      isUrgent: false,
      tags: ['study-tips', 'focus', 'wellness']
    }
  ];

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'gray';
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Peer Support Forum</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Safe space for anonymous support and guidance
          </p>
        </div>
        <button 
          onClick={() => setShowNewPostModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">Complete Anonymity Guaranteed</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Your identity is fully protected. No IP tracking, encrypted sessions, and secure communication.
            </p>
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
                placeholder="Search posts, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {post.title}
                  </h3>
                  {post.isUrgent && (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  {post.isResolved && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className={`w-3 h-3 rounded-full ${
                      post.author === 'Counselor' ? 'bg-green-500' : 
                      post.author === 'Peer' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.timestamp}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    getCategoryColor(post.category) === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    getCategoryColor(post.category) === 'purple' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                    getCategoryColor(post.category) === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    getCategoryColor(post.category) === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {categories.find(c => c.id === post.category)?.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {post.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <Reply className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.replies} replies</span>
                </button>
              </div>
              
              <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                View Discussion
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Crisis Resources */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Crisis Support Resources</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              If you're experiencing a mental health crisis, please reach out for immediate help:
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-red-700 dark:text-red-300">
                <strong>National Suicide Prevention Lifeline:</strong> 988
              </p>
              <p className="text-red-700 dark:text-red-300">
                <strong>Crisis Text Line:</strong> Text HOME to 741741
              </p>
              <p className="text-red-700 dark:text-red-300">
                <strong>Campus Counseling:</strong> Available 24/7 at ext. 2222
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};