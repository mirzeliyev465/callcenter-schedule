import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Home = ({ setCurrentView, isAdmin, activeMonth }) => {
  const { users, userId } = useAuth();
  
  // İstifadəçi məlumatlarını götür
  const currentUser = users[userId];
  const currentUserName = currentUser ? 
    `${currentUser.name} ${currentUser.surname || ''}`.trim() : 
    'İstifadəçi';

  return (
    <div className="p-8">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-6">Xoş Gəlmisiniz, {currentUserName}!</h2>
      <p className="text-xl text-gray-600 mb-8">
        Bu, aylıq növbə cədvəllərini və sorğuları idarə etmək üçün mərkəzi sistemdir.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Sistem Məlumatları</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>İstifadəçi ID:</strong> {userId}</p>
            <p><strong>Rol:</strong> <span className={`font-bold ${isAdmin ? 'text-red-600' : 'text-green-600'}`}>
              {isAdmin ? 'Admin' : 'Operator'}
            </span></p>
            <p><strong>Aktiv Ay:</strong> {activeMonth}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Sürətli Əməliyyatlar</h3>
          <div className="space-y-2">
            <button 
              onClick={() => setCurrentView(isAdmin ? 'admin' : 'schedule')}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition text-sm font-medium"
            >
              {isAdmin ? '📊 İdarəetmə Panelinə Keçid' : '📅 Cədvəlimi Yoxla'}
            </button>
            <button 
              onClick={() => setCurrentView('requests')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              📨 Sorğu Göndər
            </button>
          </div>
        </div>
      </div>

      {/* Firebase struktur məlumatı */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Firebase Struktur Məlumatı:</h4>
        <p className="text-sm text-yellow-700">
          <strong>Path:</strong> artifacts/{appId}/public/data/users
        </p>
        <p className="text-sm text-yellow-700">
          <strong>Yüklənən İstifadəçilər:</strong> {Object.keys(users).length}
        </p>
        {currentUser && (
          <p className="text-sm text-yellow-700">
            <strong>Cari İstifadəçi:</strong> {currentUser.name} ({currentUser.role})
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;