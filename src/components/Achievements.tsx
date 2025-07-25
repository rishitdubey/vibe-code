import React, { useState } from 'react';
import { 
  Award, 
  Trophy, 
  Star, 
  Medal, 
  Target, 
  TrendingUp,
  Calendar,
  Users,
  BookOpen,
  MessageSquare,
  Shield,
  Crown
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'community' | 'leadership' | 'special';
  icon: string;
  points: number;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
  requirements: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const Achievements: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'earned' | 'available' | 'leaderboard'>('earned');

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Academic Excellence',
      description: 'Maintain a GPA above 3.8 for two consecutive semesters',
      category: 'academic',
      icon: 'trophy',
      points: 500,
      earnedDate: '2024-01-15',
      requirements: ['GPA > 3.8', 'Two semesters', 'No failing grades'],
      rarity: 'epic'
    },
    {
      id: '2',
      title: 'Community Contributor',
      description: 'Share 50 helpful resources with the community',
      category: 'community',
      icon: 'users',
      points: 300,
      earnedDate: '2024-01-10',
      requirements: ['Share 50 resources', '80% helpful rating'],
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Study Streak Master',
      description: 'Maintain a 30-day study streak',
      category: 'academic',
      icon: 'target',
      points: 200,
      progress: 22,
      maxProgress: 30,
      requirements: ['Study daily for 30 days', 'Minimum 2 hours per day'],
      rarity: 'common'
    },
    {
      id: '4',
      title: 'Peer Mentor',
      description: 'Help 100 students through the support forum',
      category: 'leadership',
      icon: 'shield',
      points: 400,
      progress: 45,
      maxProgress: 100,
      requirements: ['Answer 100 forum questions', '90% helpful rating'],
      rarity: 'rare'
    },
    {
      id: '5',
      title: 'Knowledge Champion',
      description: 'Upload 100 study materials to the library',
      category: 'community',
      icon: 'book',
      points: 600,
      earnedDate: '2024-01-05',
      requirements: ['Upload 100 materials', 'Average 4+ star rating'],
      rarity: 'legendary'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah Chen', points: 2450, badges: 12 },
    { rank: 2, name: 'Alex Johnson', points: 2180, badges: 9 },
    { rank: 3, name: 'Mike Rodriguez', points: 1950, badges: 8 },
    { rank: 4, name: 'Emily Davis', points: 1720, badges: 7 },
    { rank: 5, name: 'John Smith', points: 1650, badges: 6 }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return <Trophy className="w-6 h-6" />;
      case 'users': return <Users className="w-6 h-6" />;
      case 'target': return <Target className="w-6 h-6" />;
      case 'shield': return <Shield className="w-6 h-6" />;
      case 'book': return <BookOpen className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'shadow-lg shadow-yellow-500/20 border-yellow-200';
      case 'epic': return 'shadow-lg shadow-purple-500/20 border-purple-200';
      case 'rare': return 'shadow-lg shadow-blue-500/20 border-blue-200';
      default: return 'border-gray-200';
    }
  };

  const earnedAchievements = achievements.filter(a => a.earnedDate);
  const availableAchievements = achievements.filter(a => !a.earnedDate);
  const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your progress and celebrate milestones
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{earnedAchievements.length}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Achievements Earned</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-indigo-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalPoints}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">2</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Rank</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{availableAchievements.length}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'earned', label: 'Earned', count: earnedAchievements.length },
            { id: 'available', label: 'Available', count: availableAchievements.length },
            { id: 'leaderboard', label: 'Leaderboard', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'earned' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {earnedAchievements.map((achievement) => (
                <div key={achievement.id} className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 border-2 ${getRarityGlow(achievement.rarity)} dark:border-gray-600`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${getRarityColor(achievement.rarity)} rounded-lg flex items-center justify-center text-white`}>
                      {getIcon(achievement.icon)}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">+{achievement.points}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{achievement.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      achievement.category === 'academic' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      achievement.category === 'community' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      achievement.category === 'leadership' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {achievement.category}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(achievement.earnedDate!).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'available' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableAchievements.map((achievement) => (
                <div key={achievement.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 opacity-75">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center text-gray-500">
                      {getIcon(achievement.icon)}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-500 dark:text-gray-400">+{achievement.points}</span>
                      <p className="text-xs text-gray-400">points</p>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{achievement.description}</p>
                  
                  {achievement.progress !== undefined && achievement.maxProgress && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Requirements:</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {achievement.requirements.map((req, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Top Achievers</h3>
                <p className="text-gray-600 dark:text-gray-400">Compete with your peers and climb the rankings</p>
              </div>
              
              {leaderboard.map((user, index) => (
                <div key={user.rank} className={`flex items-center justify-between p-4 rounded-lg ${
                  user.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800' :
                  user.name === 'Alex Johnson' ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800' :
                  'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      user.rank === 1 ? 'bg-yellow-500 text-white' :
                      user.rank === 2 ? 'bg-gray-400 text-white' :
                      user.rank === 3 ? 'bg-amber-600 text-white' :
                      'bg-gray-300 text-gray-700'
                    }`}>
                      {user.rank <= 3 ? (
                        user.rank === 1 ? <Crown className="w-5 h-5" /> :
                        user.rank === 2 ? <Medal className="w-5 h-5" /> :
                        <Award className="w-5 h-5" />
                      ) : (
                        user.rank
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.badges} achievements</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{user.points}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">points</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};