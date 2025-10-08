import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Xoş gəlmisiniz!',
      message: 'Növbə sisteminə uğurlu giriş etdiniz.',
      time: '10:30',
      date: '2024-01-15',
      read: false,
      icon: '👋'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Gözləyən Təsdiqlər',
      message: '3 smən dəyişiklik tələbiniz admin tərəfindən gözləyir.',
      time: '09:15',
      date: '2024-01-15',
      read: false,
      icon: '⏳'
    },
    {
      id: 3,
      type: 'success',
      title: 'Növbə Təsdiqləndi',
      message: '20 Yanvar tarixli növbəniz təsdiqləndi.',
      time: '14:20',
      date: '2024-01-14',
      read: true,
      icon: '✅'
    },
    {
      id: 4,
      type: 'error',
      title: 'Növbə Ləğv Edildi',
      message: '22 Yanvar tarixli növbəniz ləğv edildi.',
      time: '16:45',
      date: '2024-01-14',
      read: true,
      icon: '❌'
    }
  ]);

  const notificationsRef = useRef(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationColor = (type) => {
    const colors = {
      info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
      success: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
      error: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
    };
    return colors[type] || colors.info;
  };

  const getNotificationIcon = (type) => {
    const icons = {
      info: '💡',
      warning: '⚠️',
      success: '✅',
      error: '❌'
    };
    return icons[type] || '💡';
  };

  return (
    <div className="relative" ref={notificationsRef}>
      <button
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        className="relative p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 010 11.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications dropdown */}
      {notificationsOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Bildirişlər</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {unreadCount} oxunmamış bildiriş
              </p>
            </div>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Hamısını oxundu kimi qeyd et
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Təmizlə
                </button>
              )}
            </div>
          </div>

          {/* Notifications list */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 010 11.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Heç bir bildiriş yoxdur</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-750 ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex space-x-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-lg">
                        {notification.icon}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.date} • {notification.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-lg">
              <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
                Bütün Bildirişləri Gör
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;