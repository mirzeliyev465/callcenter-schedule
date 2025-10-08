import React, { useState } from 'react';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      action: 'USER_CREATED',
      description: 'Yeni istifadəçi əlavə edildi: Günay Quliyeva',
      user: 'Fərid Hüseynov',
      timestamp: '2024-01-15 10:30:25',
      ip: '192.168.1.100',
      severity: 'info'
    },
    {
      id: 2,
      action: 'SCHEDULE_UPDATED',
      description: 'Növbə təyin edildi: 20 Yanvar - 9-5 Smən',
      user: 'Fərid Hüseynov',
      timestamp: '2024-01-15 09:15:42',
      ip: '192.168.1.100',
      severity: 'info'
    },
    {
      id: 3,
      action: 'SHIFT_CHANGE_APPROVED',
      description: 'Smən dəyişikliyi təsdiqləndi: Günay Quliyeva',
      user: 'Fərid Hüseynov',
      timestamp: '2024-01-14 16:20:18',
      ip: '192.168.1.100',
      severity: 'success'
    },
    {
      id: 4,
      action: 'USER_DELETED',
      description: 'İstifadəçi silindi: Əli Məmmədov',
      user: 'Fərid Hüseynov',
      timestamp: '2024-01-14 14:45:33',
      ip: '192.168.1.100',
      severity: 'warning'
    },
    {
      id: 5,
      action: 'SYSTEM_BACKUP',
      description: 'Sistem backup-u avtomatik tamamlandı',
      user: 'System',
      timestamp: '2024-01-14 03:00:00',
      ip: '127.0.0.1',
      severity: 'info'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7days');

  const getSeverityColor = (severity) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[severity] || colors.info;
  };

  const getActionIcon = (action) => {
    const icons = {
      USER_CREATED: '👤',
      USER_UPDATED: '✏️',
      USER_DELETED: '🗑️',
      SCHEDULE_CREATED: '📅',
      SCHEDULE_UPDATED: '🔄',
      SCHEDULE_DELETED: '❌',
      SHIFT_CHANGE_APPROVED: '✅',
      SHIFT_CHANGE_REJECTED: '❌',
      SYSTEM_BACKUP: '💾',
      LOGIN: '🔐',
      LOGOUT: '🚪'
    };
    return icons[action] || '📝';
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.severity === filter;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Audit Logları
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Sistem aktivliklərinin monitorinqi
              </p>
          </div>
          
          <div className="flex space-x-3">
            {/* Date range filter */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="form-select text-sm"
            >
              <option value="1day">Son 24 saat</option>
              <option value="7days">Son 7 gün</option>
              <option value="30days">Son 30 gün</option>
              <option value="all">Bütün zamanlar</option>
            </select>

            {/* Severity filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-select text-sm"
            >
              <option value="all">Bütün loglar</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-750">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Əməliyyat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Təsvir
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                İstifadəçi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Zaman
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                IP Ünvanı
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getActionIcon(log.action)}</span>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">{log.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{log.user}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{log.timestamp}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">{log.ip}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Heç bir log tapılmadı</h3>
          <p className="text-gray-500 dark:text-gray-400">Seçilmiş filtrlərə uyğun log yoxdur.</p>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Ümumi {filteredLogs.length} log</span>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            Logları Export Et
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogs;