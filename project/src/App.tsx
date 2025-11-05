import React, { useState, useEffect } from 'react';
//import { User } from 'lucide-react';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import ExplorerPage from './components/ExplorerPage';
import ProfilePage from './components/ProfilePage';
import { UserData } from './types/user';

type Page = 'home' | 'register' | 'login' | 'explorer' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('beachExplorerUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('beachExplorerUser', JSON.stringify(userData));
    setCurrentPage('explorer');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('beachExplorerUser');
    setCurrentPage('home');
  };

  const handleDeleteAccount = () => {
    setUser(null);
    localStorage.removeItem('beachExplorerUser');
    localStorage.removeItem('beachExplorerUsers');
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} user={user} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} onRegister={handleLogin} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case 'explorer':
        return <ExplorerPage onNavigate={setCurrentPage} user={user} />;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} user={user} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} />;
      default:
        return <HomePage onNavigate={setCurrentPage} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {renderPage()}
    </div>
  );
}

export default App;