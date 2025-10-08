import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmDialog from '../Common/ConfirmDialog';

const OperatorProfile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    phone: '+994 50 123 45 67',
    department: 'Əməliyyat',
    position: 'Operator',
    startDate: '2024-01-01'
  });

  // Statistics data
  const stats = {
    totalShifts: 45,
    completedShifts: 42,
    pendingRequests: 2,
    approvalRate: 93,
    averageHours: 8.2
  };

  const recentActivity = [
    {
      id: 1,
      action: 'Növbə Təyin Edildi',
      description: '25 Yanvar - 9-5 Smən',
      time: '2 saat əvvəl',
      type: 'info'
    },
    {
      id: 2,
      action: 'Smən Dəyişikliyi',
      description: 'Tələb göndərildi: 9-5 → 10-6',
      time: '1 gün əvvəl',
      type: 'warning'
    },
    {
      id: 3,
      action: 'Növbə Təsdiqləndi',
      description: '20 Yanvar növbəsi təsdiqləndi',
      time: '2 gün əvvəl',
      type: 'success'
    }
  ];

  const handleSave = () => {
    // Burada məlumatların saxlanması məntiqi olacaq
    console.log('Saving profile data:', formData);
    setIsEditing(false);
    // Burada API call olacaq
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      surname: user?.surname || '',
      email: user?.email || '',
      phone: '+994 50 123 45 67',
      department: 'Əməliyyat',
      position: 'Operator',
      startDate: '2024-01-01'
    });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0)}{user?.surname?.charAt(0)}
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {user?.name} {user?.surname}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                  Operator
                </span>
                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                  Aktiv
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4 lg:mt-0">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Profili Redaktə Et
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="btn-success"
                >
                  Yadda Saxla
                </button>
                <button
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Ləğv Et
                </button>
              </>
            )}
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="btn-danger"
            >
              Çıxış
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Statistika
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Ümumi Növbələr</span>
                <span className="font-semibold text-gray-800 dark:text-white">{stats.totalShifts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Tamamlanmış</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{stats.completedShifts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Gözləyən Tələblər</span>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">{stats.pendingRequests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Təsdiq Nisbəti</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{stats.approvalRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Ort. İş Saatı</span>
                <span className="font-semibold text-gray-800 dark:text-white">{stats.averageHours}h</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Sürətli Əməliyyatlar
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
                Şifrəni Dəyiş
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
                Bildiriş Tənzimləmələri
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
                Məlumatlarımı Export Et
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'profile'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Şəxsi Məlumatlar
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'activity'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Son Fəaliyyət
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Ad</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="form-label">Soyad</label>
                      <input
                        type="text"
                        value={formData.surname}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="form-label">Telefon</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="form-label">Departament</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="form-label">Vəzifə</label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="form-label">İşə Başlama Tarixi</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      disabled={!isEditing}
                      className="form-input disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'success' ? 'bg-green-100 text-green-600' :
                        activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {activity.type === 'success' && '✓'}
                        {activity.type === 'warning' && '!'}
                        {activity.type === 'info' && 'i'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {activity.action}
                          </h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={logout}
        title="Çıxışı Təsdiqləyin"
        message="Hesabınızdan çıxmaq istədiyinizdən əminsiniz?"
        confirmText="Çıxış"
        cancelText="Ləğv Et"
        type="warning"
      />
    </div>
  );
};

export default OperatorProfile;