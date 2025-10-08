import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const OperatorDashboard = ({ activeMonth }) => {
  const { users, userId } = useAuth();
  const currentUser = users[userId] || {};
  const currentUserName = `${currentUser.name || ''} ${currentUser.surname || ''}`.trim();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Başlıq */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8">👨‍💼 Operator Paneli</h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sürətli əməliyyatlar */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500 hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">⚡ Sürətli Əməliyyatlar</h3>
          <div className="space-y-3 text-gray-700">
            <p>Cari ay: <strong>{activeMonth}</strong></p>
            <p>Xoş gəlmisiniz, <strong>{currentUserName || 'Operator'}</strong></p>
          </div>

          <div className="mt-6 space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              📅 Mənim Cədvəlim
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              ✉️ Sorğu Göndər
            </button>
          </div>
        </div>

        {/* Son fəaliyyətlər */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500 hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-4 text-green-700">📊 Son Fəaliyyət</h3>
          <ul className="space-y-2 text-gray-600 list-disc list-inside">
            <li>Sistemə giriş edildi</li>
            <li>Cədvəl məlumatları yükləndi</li>
            <li>Son dəyişikliklər yoxlanıldı</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default OperatorDashboard;
