import React, { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Users, AlertTriangle, Star, Navigation, Guitar as Hospital, Shield } from 'lucide-react';
import { UserData, Beach, WeatherData } from '../types/user';
import BeachCard from './BeachCard';
import { INDIAN_BEACHES } from '../data/beaches';

interface ExplorerPageProps {
  onNavigate: (page: 'home' | 'register' | 'login' | 'explorer' | 'profile') => void;
  user: UserData | null;
}

const ExplorerPage: React.FC<ExplorerPageProps> = ({ onNavigate, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [beaches, setBeaches] = useState<Beach[]>(INDIAN_BEACHES);
  const [filteredBeaches, setFilteredBeaches] = useState<Beach[]>(INDIAN_BEACHES);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'safe' | 'popular'>('all');
  const [showReports, setShowReports] = useState(false);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    let filtered = beaches;
    
    if (searchTerm) {
      filtered = filtered.filter(beach =>
        beach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beach.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beach.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilter === 'safe') {
      filtered = filtered.filter(beach => beach.safety === 'high');
    } else if (selectedFilter === 'popular') {
      filtered = filtered.sort((a, b) => b.popularActivities.length - a.popularActivities.length).slice(0, 10);
    }

    setFilteredBeaches(filtered);
  }, [searchTerm, beaches, selectedFilter]);

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem('beachReports') || '[]');
    setReports(storedReports);
  }, []);
  const safeBeaches = beaches.filter(beach => beach.safety === 'high').slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('home')}
                className="text-2xl font-bold text-blue-800 hover:text-blue-600 transition-colors"
              >
                🌴 Beach Explorer
              </button>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>{user.name}</span>
                </button>
              )}
              {user && (
                <button
                  onClick={() => setShowReports(!showReports)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Reports ({reports.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Reports Panel */}
        {showReports && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              Recent Reports
            </h3>
            {reports.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {reports.slice(-10).reverse().map((report) => (
                  <div key={report.id} className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-red-800">{report.beachName}</h4>
                        <p className="text-sm text-red-600 capitalize">{report.type} Alert</p>
                      </div>
                      <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded">
                        {report.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{report.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Reported by: {report.reportedBy}</span>
                      <span>{report.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No reports submitted yet.</p>
            )}
          </div>
        )}
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
              <input
                type="text"
                placeholder="Search beaches by name, location, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                }`}
              >
                All Beaches
              </button>
              <button
                onClick={() => setSelectedFilter('safe')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedFilter === 'safe'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-600 border border-green-600 hover:bg-green-50'
                }`}
              >
                Safe Beaches
              </button>
              <button
                onClick={() => setSelectedFilter('popular')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedFilter === 'popular'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-50'
                }`}
              >
                Popular
              </button>
            </div>
          </div>

          {/* Top 5 Safest Beaches Widget */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
              <Star className="w-6 h-6 mr-2" />
              Top 5 Safest Beaches
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {safeBeaches.map((beach, index) => (
                <div key={beach.id} className="text-center">
                  <div className="relative">
                    <img
                      src={beach.image}
                      alt={beach.name}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm text-gray-800">{beach.name}</h4>
                  <p className="text-xs text-gray-600">{beach.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Beach Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBeaches.map((beach) => (
            <BeachCard key={beach.id} beach={beach} user={user} />
          ))}
        </div>

        {filteredBeaches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏖️</div>
            <h3 className="text-xl font-semibold text-blue-800 mb-2">No beaches found</h3>
            <p className="text-blue-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorerPage;