import React from 'react';
import { ArrowLeft, User, Mail, Phone, Calendar, LogOut, Trash2 } from 'lucide-react';
import { UserData } from '../types/user';

interface ProfilePageProps {
  onNavigate: (page: 'home' | 'register' | 'login' | 'explorer' | 'profile') => void;
  user: UserData | null;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, user, onLogout, onDeleteAccount }) => {
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Please log in to view your profile</h2>
          <button
            onClick={() => onNavigate('login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleDeleteConfirm = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      onDeleteAccount();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('explorer')}
              className="p-2 hover:bg-blue-50 rounded-full transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 text-blue-600" />
            </button>
            <h1 className="text-2xl font-bold text-blue-800">My Profile</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white">
            <div className="flex items-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mr-6">
                <User className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                <p className="text-blue-100">Beach Explorer Member</p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-8">
            <h3 className="text-xl font-bold text-blue-800 mb-6">Personal Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <User className="w-6 h-6 text-blue-600 mr-4" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Full Name</p>
                  <p className="text-blue-800 font-semibold">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600 mr-4" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Age</p>
                  <p className="text-blue-800 font-semibold">{user.age} years</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600 mr-4" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Email</p>
                  <p className="text-blue-800 font-semibold">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <Phone className="w-6 h-6 text-blue-600 mr-4" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Mobile</p>
                  <p className="text-blue-800 font-semibold">{user.mobile}</p>
                </div>
              </div>
            </div>

            {/* Account Statistics */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Account Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">12</div>
                  <div className="text-sm text-green-700">Beaches Visited</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">5</div>
                  <div className="text-sm text-yellow-700">Reviews Written</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">3</div>
                  <div className="text-sm text-purple-700">Alerts Reported</div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Account Actions</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('explorer')}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Continue Exploring
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;