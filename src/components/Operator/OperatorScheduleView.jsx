import React, { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";

// Demo məlumatlar
const demoShifts = [
  { value: '9-5', label: '9-5 Smən', color: 'blue' },
  { value: '9-6', label: '9-6 Smən', color: 'green' },
  { value: '10-6', label: '10-6 Smən', color: 'yellow' },
  { value: '10-7', label: '10-7 Smən', color: 'orange' },
  { value: '11-7', label: '11-7 Smən', color: 'red' },
  { value: '12-8', label: '12-8 Smən', color: 'purple' },
  { value: '1-9', label: '1-9 Smən', color: 'indigo' },
  { value: 'off', label: 'Off Günü', color: 'gray' },
  { value: 'm', label: 'Məzuniyyət (M)', color: 'pink' }
];

// Operatorun növbələri
const operatorSchedules = [
  { id: 1, date: '2024-01-15', shift: '9-5', operatorId: 2, operatorName: 'Günay Quliyeva', status: 'approved' },
  { id: 2, date: '2024-01-16', shift: '11-7', operatorId: 2, operatorName: 'Günay Quliyeva', status: 'approved' },
  { id: 3, date: '2024-01-17', shift: 'off', operatorId: 2, operatorName: 'Günay Quliyeva', status: 'approved' },
  { id: 4, date: '2024-01-18', shift: '10-6', operatorId: 2, operatorName: 'Günay Quliyeva', status: 'approved' },
  { id: 5, date: '2024-01-19', shift: '9-6', operatorId: 2, operatorName: 'Günay Quliyeva', status: 'approved' },
  { id: 6, date: '2024-01-22', shift: '12-8', operatorId: 2, operatorName: 'Günay Quliyeva', status: 'approved' },
  { id: 7, date: '2024-01-23', shift: '1-9', operatorId: 2, operatorName: 'Günay Quliyeva', status: 'approved' },
  { id: 8, date: '2024-01-24', shift: 'm', operatorId: 2, operatorName: 'Günay Quliyeva', status: 'approved' }
];

const demoApprovalRequests = [];

const OperatorScheduleView = () => {
  const { user, logout } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [requestedShift, setRequestedShift] = useState('');
  const [reason, setReason] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Operatorun cədvəlini yüklə
  useEffect(() => {
    if (user) {
      const userSchedules = operatorSchedules.filter(s => s.operatorId === user.id);
      setSchedules(userSchedules);
    }
  }, [user]);

  // Ayın günlərini generasiya et
  const generateDayArray = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const days = generateDayArray(currentYear, currentMonth);

  // Gün üçün növbəni tap
  const getShiftForDay = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return schedules.find(schedule => schedule.date === dateStr);
  };

  // Ay dəyişdir
  const handleMonthChange = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // Smən dəyişmə tələbi göndər
  const requestShiftChange = () => {
    if (!selectedSchedule || !requestedShift || !reason) {
      alert('Zəhmət olmazsa bütün sahələri doldurun!');
      return;
    }

    const newRequest = {
      id: Date.now(),
      type: 'shift_change',
      operatorId: user.id,
      operatorName: `${user.name} ${user.surname}`,
      currentShift: selectedSchedule.shift,
      requestedShift: requestedShift,
      date: selectedSchedule.date,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      reason: reason,
      approvedBy: null,
      approvedAt: null
    };

    demoApprovalRequests.push(newRequest);
    
    setShowChangeModal(false);
    setSelectedSchedule(null);
    setRequestedShift('');
    setReason('');
    
    alert('Smən dəyişmə tələbiniz göndərildi! Admin tərəfindən təsdiqləndikdən sonra dəyişikliklər əks olunacaq.');
  };

  // Rəng kodunu almaq
  const getColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      green: 'bg-green-100 text-green-800 border-green-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      orange: 'bg-orange-100 text-orange-800 border-orange-300',
      red: 'bg-red-100 text-red-800 border-red-300',
      purple: 'bg-purple-100 text-purple-800 border-purple-300',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      gray: 'bg-gray-100 text-gray-800 border-gray-300',
      pink: 'bg-pink-100 text-pink-800 border-pink-300'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const monthNames = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
    'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
  ];

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Yüklənir...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Növbə Cədvəlim</h1>
          <p className="text-gray-600">Xoş gəlmisiniz, {user.name} {user.surname}</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-medium"
        >
          Çıxış
        </button>
      </div>

      {/* Aylıq Cədvəl Görünüşü */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Aylıq Növbə Cədvəli</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleMonthChange(-1)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              ◀ Əvvəlki Ay
            </button>
            <span className="text-xl font-bold">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              onClick={() => handleMonthChange(1)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Növbəti Ay ▶
            </button>
          </div>
        </div>

        {/* Təqvim Gridi */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'].map(day => (
              <div key={day} className="p-4 text-center font-semibold text-gray-700 border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7">
            {days.map(day => {
              const schedule = getShiftForDay(day);
              const shift = demoShifts.find(s => s.value === schedule?.shift);
              const date = new Date(currentYear, currentMonth, day);
              const isToday = new Date().toDateString() === date.toDateString();
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              
              return (
                <div
                  key={day}
                  className={`min-h-24 p-2 border-r border-b ${
                    isWeekend ? 'bg-gray-50' : 'bg-white'
                  } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-medium ${
                      isToday ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {day}
                    </span>
                    {isToday && (
                      <span className="text-xs bg-blue-500 text-white px-1 rounded">Bu gün</span>
                    )}
                  </div>
                  
                  {schedule ? (
                    <div className="space-y-1">
                      <div
                        className={`text-xs p-1 rounded text-center cursor-pointer ${getColorClass(shift?.color)}`}
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setShowChangeModal(true);
                        }}
                      >
                        {shift?.label || schedule.shift}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setShowChangeModal(true);
                        }}
                        className="w-full text-xs bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
                      >
                        Dəyiş
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        // Boş gün üçün yeni növbə tələbi
                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        setSelectedSchedule({
                          date: dateStr,
                          shift: '',
                          operatorId: user.id
                        });
                        setShowChangeModal(true);
                      }}
                      className="w-full text-xs bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                    >
                      + Növbə Tələb Et
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cədvəl Görünüşü */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Növbə Siyahısı</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gün</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Smən</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedules.map(schedule => {
                const shift = demoShifts.find(s => s.value === schedule.shift);
                const date = new Date(schedule.date);
                const dayNames = ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'];
                
                return (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{schedule.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dayNames[date.getDay()]}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded text-sm ${getColorClass(shift?.color)}`}>
                        {shift?.label || schedule.shift}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${
                        schedule.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {schedule.status === 'approved' ? 'Təsdiqləndi' : 'Gözləyir'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setShowChangeModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Smən Dəyiş
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gözləyən Tələblər */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Gözləyən Tələblərim</h2>
        {demoApprovalRequests.filter(r => r.operatorId === user.id && r.status === 'pending').length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Heç bir gözləyən tələbiniz yoxdur
          </div>
        ) : (
          <div className="space-y-3">
            {demoApprovalRequests
              .filter(r => r.operatorId === user.id && r.status === 'pending')
              .map(request => (
                <div key={request.id} className="border rounded-lg p-4 bg-yellow-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{request.date} tarixi üçün smən dəyişikliyi</p>
                      <p className="text-sm text-gray-600">
                        {request.currentShift} → {request.requestedShift}
                      </p>
                      {request.reason && (
                        <p className="text-sm text-gray-600 mt-1">Səbəb: {request.reason}</p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Admin təsdiqi gözləyir
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Smən Dəyişmə Modalı */}
      {showChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {selectedSchedule?.shift ? 'Smən Dəyişikliyi' : 'Yeni Növbə Tələbi'}
            </h3>
            
            {selectedSchedule && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Tarix: {selectedSchedule.date}</p>
                {selectedSchedule.shift && (
                  <p className="text-sm text-gray-600">Cari Smən: {selectedSchedule.shift}</p>
                )}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedSchedule?.shift ? 'Yeni Smən' : 'Smən'} *
                </label>
                <select
                  value={requestedShift}
                  onChange={(e) => setRequestedShift(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Smən seçin</option>
                  {demoShifts.map(shift => (
                    <option key={shift.value} value={shift.value}>{shift.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedSchedule?.shift ? 'Dəyişiklik Səbəbi' : 'Tələb Səbəbi'} *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Səbəbi qeyd edin..."
                  className="w-full border rounded px-3 py-2 h-20 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-between space-x-2 mt-4">
              <button
                onClick={requestShiftChange}
                disabled={!requestedShift || !reason}
                className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
              >
                {selectedSchedule?.shift ? 'Dəyişiklik Tələb Et' : 'Növbə Tələb Et'}
              </button>
              <button
                onClick={() => {
                  setShowChangeModal(false);
                  setSelectedSchedule(null);
                  setRequestedShift('');
                  setReason('');
                }}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                Ləğv Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorScheduleView;