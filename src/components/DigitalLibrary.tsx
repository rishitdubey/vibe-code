import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Eye, 
  Star, 
  Clock,
  FileText,
  Video,
  Image,
  Link,
  ChevronRight,
  Grid,
  List
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'image' | 'link';
  subject: string;
  year: number;
  branch: string;
  uploadedBy: string;
  uploadDate: string;
  downloads: number;
  rating: number;
  size?: string;
  duration?: string;
}

export const DigitalLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Data Structures and Algorithms - Complete Notes',
      type: 'pdf',
      subject: 'Computer Science',
      year: 2,
      branch: 'CSE',
      uploadedBy: 'Dr. Smith',
      uploadDate: '2024-01-15',
      downloads: 324,
      rating: 4.8,
      size: '2.4 MB'
    },
    {
      id: '2',
      title: 'Machine Learning Fundamentals - Video Lecture Series',
      type: 'video',
      subject: 'Artificial Intelligence',
      year: 3,
      branch: 'CSE',
      uploadedBy: 'Prof. Johnson',
      uploadDate: '2024-01-10',
      downloads: 156,
      rating: 4.9,
      duration: '45 min'
    },
    {
      id: '3',
      title: 'Database Design Flowchart',
      type: 'image',
      subject: 'Database Systems',
      year: 2,
      branch: 'CSE',
      uploadedBy: 'Sarah Chen',
      uploadDate: '2024-01-08',
      downloads: 89,
      rating: 4.5,
      size: '1.2 MB'
    }
  ];

  const branches = ['CSE', 'ECE', 'ME', 'CE', 'EE'];
  const years = [1, 2, 3, 4];
  const types = ['pdf', 'video', 'image', 'link'];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'video':
        return <Video className="w-6 h-6 text-blue-500" />;
      case 'image':
        return <Image className="w-6 h-6 text-green-500" />;
      case 'link':
        return <Link className="w-6 h-6 text-purple-500" />;
      default:
        return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  const filteredResources = resources.filter(resource => {
    return (
      (searchTerm === '' || resource.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedBranch === 'all' || resource.branch === selectedBranch) &&
      (selectedYear === 'all' || resource.year.toString() === selectedYear) &&
      (selectedType === 'all' || resource.type === selectedType)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Digital Library</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Upload className="w-4 h-4" />
          <span>Upload Resource</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources, subjects, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Years</option>
              {years.map(year => (
                <option key={year} value={year.toString()}>Year {year}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredResources.length} resources
          </p>
        </div>

        {viewMode === 'grid' ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  {getFileIcon(resource.type)}
                  <div className="flex space-x-1">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {resource.title}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>{resource.subject} • Year {resource.year}</p>
                  <p>By {resource.uploadedBy}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{resource.rating}</span>
                    </div>
                    <span>{resource.downloads} downloads</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {getFileIcon(resource.type)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{resource.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span>{resource.subject}</span>
                        <span>Year {resource.year}</span>
                        <span>By {resource.uploadedBy}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{resource.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {resource.downloads} downloads
                    </span>
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};