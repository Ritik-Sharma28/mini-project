import React, { useState, useCallback, useEffect } from 'react';
import AuthScreen from './src/components/AuthScreen.jsx';
import ComingSoon from './src/components/ComingSoon.jsx';
import MainAppScreen from './src/components/MainAppScreen.jsx';
import ChatListView from './src/components/views/ChatListView.jsx';
import DmScreen from './src/components/DmScreen.jsx';
import UserProfileView from './src/components/views/UserProfileView.jsx';

const App = () => {
  const [currentView, setCurrentView] = useState('auth');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [viewedProfileUserId, setViewedProfileUserId] = useState(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  
  const handleLoginSuccess = useCallback((userData) => {
    setLoggedInUser(userData);
    setCurrentView('main');
  }, []);


  const handleLogout = useCallback(() => {
    setLoggedInUser(null);
    setCurrentView('auth');
  }, []);

  const handleShowChats = useCallback(() => {
    setCurrentView('chatList');
  }, []);

  const handleStartChat = useCallback((targetUser, type = 'dm') => {
    if (type === 'dm') {
      setSelectedChatUser(targetUser);
      setCurrentView('dm');
    }
  }, []);

  const handleViewProfile = useCallback((userId) => {
    setViewedProfileUserId(userId);
    setCurrentView('userProfile');
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'coming-soon': return <ComingSoon />;
      case 'chatList': return <ChatListView onStartChat={handleStartChat} onGoBack={() => setCurrentView('main')} />;
      case 'dm': return <DmScreen user={selectedChatUser} currentUser={loggedInUser} onGoBack={() => setCurrentView('chatList')} />;
      case 'userProfile': return <UserProfileView userId={viewedProfileUserId} onStartChat={handleStartChat} onGoBack={() => setCurrentView('main')} />;
      case 'main': return <MainAppScreen user={loggedInUser} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} onProfileUpdate={setLoggedInUser} onShowChats={handleShowChats} onStartChat={handleStartChat} onViewProfile={handleViewProfile} />;
      case 'auth': default: 
        return <AuthScreen onLoginSuccess={handleLoginSuccess} theme={theme} toggleTheme={toggleTheme} />;
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-0 md:p-4">
      <div className="w-full h-full md:w-11/12 md:max-w-6xl md:h-[95vh] md:max-h-[1000px] bg-white dark:bg-gray-900 shadow-2xl flex flex-col md:rounded-3xl overflow-hidden">
        {renderView()}
      </div>
    </div>
  );
}

export default App;