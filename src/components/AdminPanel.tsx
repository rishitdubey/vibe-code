import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Award, 
  Settings, 
  BarChart3,
  Shield,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'content', label: 'Content Moderation', icon: FileText },
    { id: 'support', label: 'Support Forum', icon: MessageSquare },
    { id: 'achievements', label: 'Achievement System', icon: Award },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  const stats = [
    { label: 'Total Users', value: '2,847', change: '+12%', color: 'blue' },
    { label: 'Active Posts', value: '1,256', change: '+8%', color: 'green' },
    { label: 'Resources Shared', value: '4,891', change: '+15%', color: 'purple' },
    { label: 'Support Tickets', value: '23', change: '-5%', color: 'amber' }
  ];

  const recentActivity = [
    { user: 'Sarah Chen', action: 'uploaded new course material', time: '5 min ago', type: 'upload' },
    { user: 'Mike Johnson', action: 'reported inappropriate content', time: '12 min ago', type: 'report' },
    { user: 'Anonymous User', action: 'requested help in support forum', time: '18 min ago', type: 'support' },
    { user: 'Dr. Smith', action: 'verified club achievement', time: '25 min ago', type: 'verify' }
  ];

  const pendingReviews = [
    { id: '1', type: 'content', title: 'Advanced Algorithms PDF', reporter: 'Student', reason: 'Copyright concern' },
    { id: '2', type: 'user', title: 'Club Representative Request', reporter: 'Mike R.', reason: 'Role verification' },
    { id: '3', type: 'achievement', title: 'Leadership Badge Request', reporter: 'CS Club', reason: 'Evidence review' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-500 rounded-lg flex items-center justify-center`}>
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${
                  activity.type === 'upload' ? 'bg-blue-500' :
                  activity.type === 'report' ? 'bg-red-500' :
                  activity.type === 'support' ? 'bg-purple-500' :
                  'bg-green-500'
                }`}>
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Reviews</h3>
          <div className="space-y-3">
            {pendingReviews.map((review) => (
              <div key={review.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    review.type === 'content' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    review.type === 'user' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  }`}>
                    {review.type}
                  </span>
                  <div className="flex space-x-2">
                    <button className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{review.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Reported by {review.reporter} • {review.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4" />
          <span>Add Admin</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Joined</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Sarah Chen', email: 'sarah@university.edu', role: 'student', status: 'active', joined: '2024-01-15' },
                { name: 'Dr. Smith', email: 'smith@university.edu', role: 'admin', status: 'active', joined: '2023-08-10' },
                { name: 'Mike Johnson', email: 'mike@university.edu', role: 'club_rep', status: 'pending', joined: '2024-01-12' }
              ].map((user, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                      user.role === 'club_rep' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {new Date(user.joined).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex space-x-6">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 h-fit">
        <div className="flex items-center space-x-2 mb-6">
          <Shield className="w-6 h-6 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h2>
        </div>
        <nav className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'users' && renderUserManagement()}
        {activeSection === 'content' && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Content Moderation</h3>
            <p className="text-gray-600 dark:text-gray-400">Review and moderate user-generated content</p>
          </div>
        )}
        {activeSection === 'support' && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Support Forum Management</h3>
            <p className="text-gray-600 dark:text-gray-400">Monitor and manage support forum activities</p>
          </div>
        )}
        {activeSection === 'achievements' && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Achievement System</h3>
            <p className="text-gray-600 dark:text-gray-400">Create and manage achievement badges</p>
          </div>
        )}
        {activeSection === 'settings' && (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">System Settings</h3>
            <p className="text-gray-600 dark:text-gray-400">Configure platform settings and preferences</p>
          </div>
        )}
      </div>
    </div>
  );
};