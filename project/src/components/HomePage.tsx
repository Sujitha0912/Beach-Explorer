import React from 'react';
import { MapPin, Users, Waves, Star } from 'lucide-react';
import { UserData } from '../types/user';

interface HomePageProps {
  onNavigate: (page: 'home' | 'register' | 'login' | 'explorer' | 'profile') => void;
  user: UserData | null;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, user }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Ocean Background */}
      <div className="absolute inset-0 z-0">
        <div className="wave-animation"></div>
      </div>
      
      {/* Navigation Header */}
      <nav className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Waves className="text-blue-600 w-8 h-8" />
          <h1 className="text-2xl font-bold text-blue-800">Beach Explorer</h1>
        </div>
        <div className="flex space-x-4">
          {user ? (
            <>
              <button
                onClick={() => onNavigate('explorer')}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Explore
              </button>
              <button
                onClick={() => onNavigate('profile')}
                className="px-6 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors"
              >
                Profile
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('login')}
                className="px-6 py-2 text-blue-700 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-blue-900 mb-6 animate-fade-in">
            🌴 Beach Explorer
          </h1>
          <p className="text-xl md:text-2xl text-blue-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover India's most beautiful beaches with real-time weather, crowd levels, and safety alerts
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => onNavigate(user ? 'explorer' : 'register')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-lg font-semibold rounded-full hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {user ? 'Start Exploring' : 'Get Started'}
            </button>
            <button
              onClick={() => onNavigate('explorer')}
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-full hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg border border-blue-200"
            >
              View Beaches
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <MapPin className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Real-time Location</h3>
              <p className="text-blue-600">Get accurate beach locations with Google Maps integration and nearby facilities</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <Users className="w-12 h-12 text-cyan-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Crowd Analytics</h3>
              <p className="text-blue-600">Check crowd levels and plan your visit during optimal times</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <Star className="w-12 h-12 text-yellow-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Reviews & Safety</h3>
              <p className="text-blue-600">Read reviews, safety alerts, and contribute your own experiences</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .wave-animation {
          background: linear-gradient(45deg, #3b82f6, #06b6d4, #0891b2);
          background-size: 400% 400%;
          animation: wave 15s ease-in-out infinite;
          opacity: 0.1;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        
        @keyframes wave {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;