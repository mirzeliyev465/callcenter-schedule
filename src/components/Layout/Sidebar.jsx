import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar = ({ currentView, setCurrentView, sidebarOpen, setSidebarOpen }) => {
  const { user, isAdmin, logout } = useAuth();
  const { theme, isDark } = useTheme();
  const [activeSubmenu, setActiveSubmenu] = useState('');

  // Admin menyu elementləri
  const adminMenuItems = [
    {
      id: 'overview',
      label: 'Ümumi Baxış',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      type: 'main'
    },
    {
      id: 'users',
      label: 'İstifadəçilər',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      type: 'main'
    },
    {
      id: 'schedules',
      label: 'Növbələr',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      type: 'main'
    },
    {
      id: 'shifts',
      label: 'Smənlər',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      type: 'main'
    },
    {
      id: 'approvals',
      label: 'Təsdiqlər',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      type: 'main',
      badge: 3
    }
  ];

  // Operator menyu elementləri
  const operatorMenuItems = [
    {
      id: 'schedule',
      label: 'Növbə Cədvəlim',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      type: 'main'
    },
    {
      id: 'requests',
      label: 'Tələblərim',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      type: 'main',
      badge: 2
    }
  ];

  // Ümumi menyu elementləri
  const commonMenuItems = [
    {
      id: 'profile',
      label: 'Profil',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      type: 'profile'
    },
    {
      id: 'settings',
      label: 'Tənzimləmələr',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      type: 'settings'
    }
  ];

  const menuItems = isAdmin ? adminMenuItems : operatorMenuItems;

  const handleMenuItemClick = (itemId, itemType) => {
    if (itemType === 'main') {
      setCurrentView(itemId);
    } else if (itemType === 'submenu') {
      setActiveSubmenu(activeSubmenu === itemId ? '' : itemId);
    } else if (itemId === 'profile') {
      // Profil səhifəsinə yönləndir
      console.log('Profil səhifəsi');
    } else if (itemId === 'settings') {
      // Tənzimləmələr səhifəsinə yönləndir
      console.log('Tənzimləmələr səhifəsi');
    }
    
    // Mobil cihazlarda sidebarı bağla
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Klik hadisəsini idarə et
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        id="sidebar"
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-14 px-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-7 h-7 bg-gradient-to-r from-primary-500 to-primary-600 rounded flex items-center justify-center text-white text-xs font-bold">
                NS
              </div>
            </div>
            <div className="ml-2">
              <h1 className="text-sm font-semibold text-gray-800 dark:text-white">Növbə Sistemi</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">v1.0.0</p>
            </div>
          </div>
          
          {/* Close Button - Mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0)}{user?.surname?.charAt(0)}
              </div>
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {user?.name} {user?.surname}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isAdmin ? 'Admin' : 'Operator'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3 space-y-1 flex-1 overflow-y-auto">
          {/* Main Menu Items */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 py-1">
              Əsas Menyu
            </p>
            
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id, item.type)}
                className={`
                  group flex items-center w-full px-2 py-2 text-sm font-medium rounded transition-all duration-200
                  ${currentView === item.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <div className={`flex-shrink-0 w-4 h-4 mr-2 ${
                  currentView === item.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                }`}>
                  {item.icon}
                </div>
                
                <span className="flex-1 text-left">{item.label}</span>
                
                {item.badge && (
                  <span className={`
                    inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none rounded-full
                    ${currentView === item.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Common Menu Items */}
          <div className="space-y-1 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 py-1">
              Hesab
            </p>
            
            {commonMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id, item.type)}
                className={`
                  group flex items-center w-full px-2 py-2 text-sm font-medium rounded transition-all duration-200
                  text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white
                `}
              >
                <div className="flex-shrink-0 w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                  {item.icon}
                </div>
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={logout}
              className="group flex items-center w-full px-2 py-2 text-sm font-medium rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            >
              <svg className="flex-shrink-0 w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Çıxış
            </button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>© 2024 NS</span>
            <span className={`px-1.5 py-0.5 rounded text-xs ${
              isAdmin 
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' 
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            }`}>
              {isAdmin ? 'Admin' : 'Operator'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;