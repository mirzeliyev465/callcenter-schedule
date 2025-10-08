import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useSchedules } from '../../../hooks/useSchedules';
import { runTransaction, serverTimestamp } from 'firebase/firestore';

const AVAILABLE_SHIFTS = [
  { value: "", label: "Seçin" },
  { value: "9-5", label: "9:00 - 17:00" },
  { value: "9-6", label: "9:00 - 18:00" },
  { value: "10-7", label: "10:00 - 19:00" },
  { value: "10-6", label: "10:00 - 18:00" },
  { value: "11-7", label: "11:00 - 19:00" },
  { value: "12-8", label: "12:00 - 20:00" },
  { value: "1-9", label: "13:00 - 21:00" },
  { value: "M", label: "Məzuniyyət (M)" },
  { value: "OFF", label: "İstirahət (OFF)" }
];

const AdminScheduleAssignment = ({ activeMonth }) => {
  const { db, userId, users, appId, setLoading, setError } = useAuth();
  const { schedules, currentSchedule } = useSchedules(activeMonth);
  
  const [targetUserId, setTargetUserId] = useState('');
  const [selectedUserShifts, setSelectedUserShifts] = useState({});
  const [assignMessage, setAssignMessage] = useState('');
  
  const operatorUsers = useMemo(() => {
    return Object.values(users).filter(u => u.role === 'operator' || u.role === 'admin');
  }, [users]);
  
  const getDaysInMonth = (monthString) => {
    const [year, month] = monthString.split('-').map(Number);
    const date = new Date(year, month, 0);
    return date.getDate();
  };
  
  const dayArray = useMemo(() => {
    return Array.from({ length: getDaysInMonth(activeMonth) }, (_, i) => i + 1);
  }, [activeMonth]);

  // Hədəf istifadəçinin cari növbələrini yüklə
  useEffect(() => {
    if (targetUserId) {
      const currentShifts = currentSchedule.userAssignments[targetUserId]?.shifts || {};
      const initialShifts = {};
      for (let day = 1; day <= getDaysInMonth(activeMonth); day++) {
        initialShifts[day.toString()] = currentShifts[day.toString()] || '';
      }
      setSelectedUserShifts(initialShifts);
      setAssignMessage('');
    } else {
      setSelectedUserShifts({});
    }
  }, [targetUserId, activeMonth, currentSchedule]);

  const handleShiftChange = useCallback((day, shiftValue) => {
    setSelectedUserShifts(prev => ({
      ...prev,
      [day]: shiftValue,
    }));
  }, []);
  
  const handleSaveShiftChanges = async (targetUserId, updatedShiftsObject) => {
    if (!db || !userId || !targetUserId) return;
    setLoading(true);
    
    const monthDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'monthlySchedules', activeMonth);

    const offCount = Object.values(updatedShiftsObject).filter(s => s === 'OFF' || s === 'M').length;

    try {
      await runTransaction(db, async (transaction) => {
        const monthDoc = await transaction.get(monthDocRef);
        const existingAssignments = monthDoc.exists() ? monthDoc.data().userAssignments || {} : {};

        transaction.set(monthDocRef, {
          userAssignments: {
            ...existingAssignments,
            [targetUserId]: {
              userId: targetUserId,
              shifts: updatedShiftsObject, 
              offCount: offCount,
              assignedBy: userId,
              timestamp: serverTimestamp(),
            }
          }
        }, { merge: true });
      });
      return true;
    } catch (e) {
      console.error("Fərdi Cədvəl Təyin Etmə Xətası:", e);
      setError(`Fərdi cədvəli ${targetUserId} üçün təyin etmək mümkün olmadı.`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!targetUserId || Object.keys(selectedUserShifts).length === 0) {
      setAssignMessage('Xahiş edirik, operatoru seçin və ən azı bir növbə təyin edin.');
      return;
    }
    
    const shiftsToSave = {};
    dayArray.forEach(day => {
      const dayKey = day.toString();
      if (selectedUserShifts[dayKey]) {
        shiftsToSave[dayKey] = selectedUserShifts[dayKey];
      }
    });

    const success = await handleSaveShiftChanges(targetUserId, shiftsToSave);
    if (success) {
      setAssignMessage(`${users[targetUserId]?.name} üçün ${activeMonth} cədvəli uğurla yadda saxlanıldı!`);
    } else {
      setAssignMessage('Xəta: Cədvəli yadda saxlamaq mümkün olmadı.');
    }
  };
  
  const shiftAssignmentsReport = useMemo(() => {
    const totalOffCount = Object.values(selectedUserShifts).filter(s => s === 'OFF' || s === 'M').length;
    return { totalOffCount };
  }, [selectedUserShifts]);

  return (
    <div className="space-y-8">
      {/* Fərdi Cədvəl Təyin Edilməsi Kontrolu */}
      <div className="bg-red-50 p-6 rounded-xl shadow-lg border-t-4 border-red-600">
        <h3 className="text-2xl font-semibold mb-4 text-red-700">Fərdi Növbə Cədvəli Təyin Etmə - {activeMonth}</h3>
        
        {/* User ID Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Hədəf İstifadəçi</label>
          <select 
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            className="w-full p-2 border border-red-300 rounded-lg text-gray-800"
          >
            <option value="" disabled>Operator seçin...</option>
            {operatorUsers.map(u => (
              <option key={u.uid} value={u.uid}>{u.name} {u.surname} ({u.role === 'admin' ? 'Admin' : 'Operator'})</option>
            ))}
          </select>
        </div>
        
        {targetUserId && (
          <>
            <div className="bg-red-100 p-3 rounded-lg mb-4 font-semibold text-gray-700">
              Seçilmiş Operator: <span className="text-red-600">{users[targetUserId]?.name} {users[targetUserId]?.surname}</span> | 
              OFF/M Gün Sayı: <span className="text-red-600">{shiftAssignmentsReport.totalOffCount}</span>
            </div>
            
            {/* Gün-bə-gün Növbə Seçimi Cədvəli */}
            <div className="overflow-x-auto max-h-96 pr-2">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    {dayArray.map(day => (
                      <th key={day} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">GÜN {day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    {dayArray.map(day => (
                      <td key={day} className="p-1 text-center border border-gray-100">
                        <select
                          value={selectedUserShifts[day.toString()] || ''}
                          onChange={(e) => handleShiftChange(day.toString(), e.target.value)}
                          className={`w-full p-2 text-xs border rounded-lg focus:ring-blue-500 focus:border-blue-500 font-semibold
                            ${selectedUserShifts[day.toString()] === 'OFF' ? 'bg-green-100 text-green-700' :
                              selectedUserShifts[day.toString()] === 'M' ? 'bg-red-200 text-red-800' :
                              selectedUserShifts[day.toString()] ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-400'
                            }`}
                        >
                          {AVAILABLE_SHIFTS.map(shift => (
                            <option key={shift.value} value={shift.value}>
                              {shift.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            
            <button
              onClick={handleSave}
              className="mt-4 w-full py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-200"
            >
              Cədvəli Yadda Saxla
            </button>
          </>
        )}
        {assignMessage && <p className="mt-2 text-sm text-green-600 font-medium">{assignMessage}</p>}
      </div>

      {/* Bütün operatorların ümumi cədvəli */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-600">
        <h3 className="text-2xl font-semibold mb-4 text-red-700">Bütün Operatorların Cari Ay Növbələri</h3>
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 w-48">Operator</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">OFF/M</th>
                {dayArray.map(day => (
                  <th key={day} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-8">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {operatorUsers.map(user => {
                const uid = user.uid;
                const assignment = currentSchedule.userAssignments[uid] || { shifts: {}, offCount: 0 };

                return (
                  <tr key={uid}>
                    <td className="px-3 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white border-r w-48">
                      {user.name} {user.surname}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-bold text-red-600 w-16">
                      {assignment.offCount}
                    </td>
                    {dayArray.map(day => (
                      <td 
                        key={`${uid}-${day}`} 
                        className={`px-2 py-1 text-center text-xs border border-gray-100 font-semibold ${
                          assignment.shifts[day] === 'OFF' ? 'bg-green-100 text-green-700' :
                          assignment.shifts[day] === 'M' ? 'bg-red-200 text-red-800' :
                          assignment.shifts[day] ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-400'
                        }`}
                      >
                        {assignment.shifts[day] ? assignment.shifts[day] : '-'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {operatorUsers.length === 0 && <p className="text-center text-gray-500 mt-4">Hələ heç bir istifadəçi qeydiyyatdan keçməyib.</p>}
      </div>
    </div>
  );
};

export default AdminScheduleAssignment;