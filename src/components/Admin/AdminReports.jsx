import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminReports = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('summary');

  // Demo report data
  const reportData = {
    summary: {
      title: 'Ümumi Statistika',
      data: {
        totalUsers: 24,
        totalSchedules: 156,
        totalShifts: 7,
        approvalRate: 85,
        averageShiftsPerUser: 6.5,
        busiestDay: 'Çərşənbə',
        mostPopularShift: '9-5 Smən'
      }
    },
    users: {
      title: 'İstifadəçi Fəaliyyəti',
      data: [
        { name: 'Günay Quliyeva', shifts: 12, changes: 3, approvalRate: 92 },
        { name: 'Əli Məmmədov', shifts: 10, changes: 1, approvalRate: 100 },
        { name: 'Aygün Əliyeva', shifts: 8, changes: 2, approvalRate: 87 },
        { name: 'Rəşad Hüseynov', shifts: 6, changes: 0, approvalRate: 100 }
      ]
    },
    shifts: {
      title: 'Smən Analizi',
      data: [
        { shift: '9-5 Smən', count: 45, percentage: 28.8 },
        { shift: '10-6 Smən', count: 38, percentage: 24.4 },
        { shift: '11-7 Smən', count: 32, percentage: 20.5 },
        { shift: '12-8 Smən', count: 25, percentage: 16.0 },
        { shift: '1-9 Smən', count: 16, percentage: 10.3 }
      ]
    },
    approvals: {
      title: 'Təsdiq Statistikası',
      data: {
        totalRequests: 24,
        approved: 18,
        rejected: 4,
        pending: 2,
        averageResponseTime: '2.3 saat'
      }
    }
  };

  const generateReport = () => {
    // Burada real report generasiya məntiqi olacaq
    console.log('Generating report...', { dateRange, reportType });
  };

  const exportReport = (format) => {
    console.log(`Exporting report as ${format}...`);
    // Burada export funksionallığı olacaq
  };

  const renderReportContent = () => {
    const report = reportData[reportType];
    
    switch (reportType) {
      case 'summary':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(report.data).map(([key, value]) => (
              <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {typeof value === 'number' ? value : `${value}%`}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </div>
              </div>
            ))}
          </div>
        );

      case 'users':
        return (
          <div className="space-y-4">
            {report.data.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.shifts} növbə • {user.changes} dəyişiklik
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">{user.approvalRate}%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Təsdiq nisbəti</div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'shifts':
        return (
          <div className="space-y-3">
            {report.data.map((shift, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{shift.shift}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{shift.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${shift.percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {shift.count} növbə
                </div>
              </div>
            ))}
          </div>
        );

      case 'approvals':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                {report.data.approved}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Təsdiqlənmiş</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                {report.data.rejected}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Rədd Edilmiş</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                {report.data.pending}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Gözləyən</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {report.data.averageResponseTime}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Ort. Cavab Müddəti</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Hesabatlar</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Sistem fəaliyyəti və performans metrikaları
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-4 lg:mt-0">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="form-select"
            >
              <option value="summary">Ümumi Statistika</option>
              <option value="users">İstifadəçi Fəaliyyəti</option>
              <option value="shifts">Smən Analizi</option>
              <option value="approvals">Təsdiq Statistikası</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="form-select"
            >
              <option value="week">Son 1 həftə</option>
              <option value="month">Son 1 ay</option>
              <option value="quarter">Son 3 ay</option>
              <option value="year">Son 1 il</option>
            </select>

            <button
              onClick={generateReport}
              className="btn-primary whitespace-nowrap"
            >
              Hesabat Yarat
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Report Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {reportData[reportType].title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {dateRange === 'week' && 'Son 1 həftə üçün'}
                {dateRange === 'month' && 'Son 1 ay üçün'}
                {dateRange === 'quarter' && 'Son 3 ay üçün'}
                {dateRange === 'year' && 'Son 1 il üçün'}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => exportReport('pdf')}
                className="btn-secondary text-sm"
              >
                PDF Export
              </button>
              <button
                onClick={() => exportReport('excel')}
                className="btn-primary text-sm"
              >
                Excel Export
              </button>
            </div>
          </div>
        </div>

        {/* Report Body */}
        <div className="p-6">
          {renderReportContent()}
        </div>

        {/* Report Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
            <div>
              Hesabat tarixi: {new Date().toLocaleDateString('az-AZ')}
            </div>
            <div>
              Hazırlayan: {user?.name} {user?.surname}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ortalama Doluluk</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">78%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aktiv İstifadəçilər</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">18</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Günlük Növbələr</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;