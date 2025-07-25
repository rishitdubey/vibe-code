import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Play,
  Download,
  ExternalLink,
  Filter,
  Plus
} from 'lucide-react';

interface Post {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  type: 'text' | 'video' | 'pdf' | 'link';
  mediaUrl?: string;
  category: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export const ContentFeed: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Dr. Sarah Chen',
      avatar: 'SC',
      timestamp: '2 hours ago',
      content: 'Advanced Data Structures lecture recording from today\'s class. We covered Red-Black Trees and their implementation. The PDF notes are also attached.',
      type: 'video',
      mediaUrl: 'https://example.com/video',
      category: 'Computer Science',
      likes: 24,
      comments: 8,
      shares: 5,
      isLiked: false,
      isBookmarked: true
    },
    {
      id: '2',
      author: 'Mike Johnson',
      avatar: 'MJ',
      timestamp: '5 hours ago',
      content: 'Just discovered this amazing Python visualization library! Perfect for our upcoming statistics project. Check out the documentation.',
      type: 'link',
      mediaUrl: 'https://plotly.com/python/',
      category: 'Programming',
      likes: 18,
      comments: 12,
      shares: 7,
      isLiked: true,
      isBookmarked: false
    },
    {
      id: '3',
      author: 'Anonymous Student',
      avatar: 'AS',
      timestamp: '1 day ago',
      content: 'Motivational quote that helped me through finals: "Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill',
      type: 'text',
      category: 'Motivation',
      likes: 42,
      comments: 15,
      shares: 12,
      isLiked: false,
      isBookmarked: false
    }
  ]);

  const filters = ['all', 'computer-science', 'programming', 'motivation', 'career'];

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const renderMedia = (post: Post) => {
    switch (post.type) {
      case 'video':
        return (
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                <Play className="w-6 h-6 text-gray-900 ml-1" />
              </button>
            </div>
            <div className="absolute bottom-4 right-4">
              <span className="bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">15:30</span>
            </div>
          </div>
        );
      case 'pdf':
        return (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">PDF Document</p>
            <button className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium">Download</button>
          </div>
        );
      case 'link':
        return (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <ExternalLink className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">External Resource</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{post.mediaUrl}</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Feed</h1>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Create Post</span>
          </button>
          <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {filter.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{post.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{post.author}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{post.timestamp}</span>
                    <span>•</span>
                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-gray-900 dark:text-white leading-relaxed">{post.content}</p>
            </div>

            {/* Media */}
            {post.mediaUrl && (
              <div className="mb-4">
                {renderMedia(post)}
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.shares}</span>
                </button>
              </div>
              
              <button
                onClick={() => handleBookmark(post.id)}
                className={`p-2 rounded-lg transition-colors ${
                  post.isBookmarked 
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' 
                    : 'text-gray-400 hover:text-amber-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};