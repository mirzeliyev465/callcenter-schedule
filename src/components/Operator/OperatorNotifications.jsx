import React, { useState } from 'react';

const OperatorNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'shift_reminder',
      title: 'Növbə Xatırlatması',
      message: 'Sabah sizin 9-5 sməniniz var. Zamanında hazır olun.',
      date: '2024-01-16',
      time: '08:00-17:00',
      read: false,
      important: true
    },
    {
      id: 2,
      type: 'shift_change',
      title: 'Smən Dəyişikliyi',
      message: 'Smən dəyişiklik tələbiniz admin tərəfindən təsdiqləndi.',
      date: '2024-01-18',
      time: '10:00-19:00',
      read: false,
      important: false
    },
    {
      id: 3,
      type: 'system',
      title: 'Sistem Yeniləməsi',
      message: 'Növbə sistemi bu həftə sonu yenilənəcək.',
      date: '2024-01-20',
      time: '23:00-02:00',
      read: true,
      important: false
    },
    {
      id: 4,
      type: 'holiday',
      title: 'Bayram Təbriki',
      message: 'Bütün işçilərə Yeni İl bayramını təbrik edirik!',
      date: '2024-01-01',
      time: '',
      read: true,
      important: false
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const getNotificationIcon = (type) => {
    const icons = {
      shift_reminder: '⏰',
      shift_change: '🔄',
      system: '🔄',
      holiday: '🎉',
      info: '💡'
    };
    return icons[type] || '💡';
  };

  const getNotificationColor = (type, important) => {
    if (important) return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10';
    
    const colors = {
      shift_reminder: 'border-l-4 border-l-blue-500',
      shift_change: 'border-l-4 border-l-green-500',
      system: 'border-l-4 border-l-purple-500',
      holiday: 'border-l-4 border-l-yellow-500'
    };
    return colors[type] || 'border-l-4 border-l-gray-500';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Bildirişlər
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {unreadCount} oxunmamış bildiriş
            </p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn-secondary text-sm"
            >
              Hamısını Oxundu kimi qeyd et
            </button>
          )}
        </div>
      </div>

      {/* Notifications list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 010 11.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Heç bir bildiriş yoxdur</h3>
            <p className="text-gray-500 dark:text-gray-400">Yeni bildirişlər burada görünəcək.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 transition-colors ${getNotificationColor(notification.type, notification.important)} ${
                !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-lg shadow-sm">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`text-sm font-semibold ${
                        notification.important 
                          ? 'text-red-700 dark:text-red-300' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          Yeni
                        </span>
                      )}
                      {notification.important && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                          Əhəmiyyətli
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      {notification.date && (
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {notification.date}
                        </span>
                      )}
                      {notification.time && (
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {notification.time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Oxundu kimi qeyd et"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Sil"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
            Bütün Bildirişləri Gör
          </button>
        </div>
      )}
    </div>
  );
};

export default OperatorNotifications;