import React from 'react';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Calendar,
  Award,
  Clock,
  Target
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Study Hours This Week', value: '28.5', icon: Clock, color: 'bg-blue-500', change: '+12%' },
    { label: 'Resources Shared', value: '47', icon: BookOpen, color: 'bg-green-500', change: '+8%' },
    { label: 'Forum Contributions', value: '23', icon: MessageSquare, color: 'bg-purple-500', change: '+15%' },
    { label: 'Achievement Points', value: '1,284', icon: Award, color: 'bg-amber-500', change: '+22%' },
  ];

  const upcomingDeadlines = [
    { subject: 'Data Structures', task: 'Assignment 3', due: '2 days', priority: 'high' },
    { subject: 'Computer Networks', task: 'Lab Report', due: '5 days', priority: 'medium' },
    { subject: 'Database Systems', task: 'Project Proposal', due: '1 week', priority: 'low' },
  ];

  const recentActivity = [
    { user: 'Sarah Chen', action: 'shared a Python tutorial', time: '2 hours ago', type: 'share' },
    { user: 'Mike Johnson', action: 'completed Algorithm Analysis', time: '4 hours ago', type: 'complete' },
    { user: 'Anonymous', action: 'asked for help in Support Forum', time: '6 hours ago', type: 'help' },
    { user: 'Dr. Smith', action: 'uploaded new course materials', time: '8 hours ago', type: 'upload' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Alex! 👋</h1>
        <p className="text-indigo-100">You have 3 upcoming deadlines and 12 new resources in your feed.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{deadline.task}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{deadline.subject}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{deadline.due}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                    deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {deadline.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${
                  activity.type === 'share' ? 'bg-blue-500' :
                  activity.type === 'complete' ? 'bg-green-500' :
                  activity.type === 'help' ? 'bg-purple-500' :
                  'bg-amber-500'
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
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Add Resource</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
            <MessageSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Ask Question</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
            <Target className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-2" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Set Goal</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Join Study Group</span>
          </button>
        </div>
      </div>
    </div>
  );
};