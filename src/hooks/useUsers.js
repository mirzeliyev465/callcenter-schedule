import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ currentView, setCurrentView, activeMonth, setActiveMonth }) => {
  const { users, userId, isAdmin } = useAuth();
  
  const currentUserName = users[userId]?.name + ' ' + (users[userId]?.surname || '');

  return (
    <div className="flex flex-col p-4 space-y-4 bg-red-700 text-white shadow-xl min-h-screen w-64">
      <h1 className="text-2xl font-extrabold text-center border-b-2 border-red-500 pb-3 mb-4">
        Növbə Sistemi
      </h1>
      <p className="text-sm text-red-200 break-words mb-2">
        <strong className="font-semibold text-red-100">İstifadəçi:</strong> {currentUserName}
      </p>
      <p className="text-xs text-red-200 break-words mb-4">
        <strong className="font-semibold text-red-100">ID:</strong> {userId || 'Yüklənir...'}
      </p>

      <button
        onClick={() => setCurrentView('home')}
        className={`w-full py-3 rounded-xl transition duration-200 font-medium ${
          currentView === 'home' ? 'bg-red-800 ring-2 ring-red-300' : 'hover:bg-red-600 bg-red-500'
        }`}
      >
        Əsas Səhifə
      </button>

      {isAdmin ? (
        <button
          onClick={() => setCurrentView('admin')}
          className={`w-full py-3 rounded-xl transition duration-200 font-medium ${
            currentView === 'admin' ? 'bg-red-800 ring-2 ring-red-300' : 'hover:bg-red-600 bg-red-500'
          }`}
        >
          İdarəetmə Paneli
        </button>
      ) : (
        <>
          <button
            onClick={() => setCurrentView('schedule')}
            className={`w-full py-3 rounded-xl transition duration-200 font-medium ${
              currentView === 'schedule' ? 'bg-red-800 ring-2 ring-red-300' : 'hover:bg-red-600 bg-red-500'
            }`}
          >
            Mənim Cədvəlim
          </button>
          <button
            onClick={() => setCurrentView('requests')}
            className={`w-full py-3 rounded-xl transition duration-200 font-medium ${
              currentView === 'requests' ? 'bg-red-800 ring-2 ring-red-300' : 'hover:bg-red-600 bg-red-500'
            }`}
          >
            Sorğu Göndər
          </button>
        </>
      )}

      <div className="mt-auto pt-4 border-t border-red-500">
        <label htmlFor="month-selector" className="block text-sm font-light text-red-200 mb-2">
          Cədvəl Ayı Seçin:
        </label>
        <input
          id="month-selector"
          type="month"
          value={activeMonth}
          onChange={(e) => setActiveMonth(e.target.value)}
          min={new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().substring(0, 7)}
          max={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().substring(0, 7)}
          className="w-full p-2 rounded-lg text-red-800 focus:ring-2 focus:ring-red-300"
        />
      </div>
    </div>
  );
};

export default Sidebar;