import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ContentFeed } from './components/ContentFeed';
import { DigitalLibrary } from './components/DigitalLibrary';
import { SupportForum } from './components/SupportForum';
import { SyllabusTracker } from './components/SyllabusTracker';
import { Achievements } from './components/Achievements';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, login, logout, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [authModalOpen, setAuthModalOpen] = useState(!user);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'feed':
        return <ContentFeed />;
      case 'library':
        return <DigitalLibrary />;
      case 'support':
        return <SupportForum />;
      case 'syllabus':
        return <SyllabusTracker />;
      case 'achievements':
        return <Achievements />;
      case 'admin':
        return user?.role === 'admin' ? <AdminPanel /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
        {user ? (
          <>
            <Header
              user={user}
              onMenuClick={() => setSidebarOpen(true)}
              onLogout={logout}
              theme={theme}
              onThemeToggle={toggleTheme}
            />
            <div className="flex">
              <Sidebar
                activeView={activeView}
                onViewChange={setActiveView}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                userRole={user.role}
              />
              <main className="flex-1 lg:ml-64 pt-16">
                <div className="p-6">
                  {renderView()}
                </div>
              </main>
            </div>
          </>
        ) : (
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onLogin={login}
            onRegister={register}
          />
        )}
      </div>
    </div>
  );
}

export default App;