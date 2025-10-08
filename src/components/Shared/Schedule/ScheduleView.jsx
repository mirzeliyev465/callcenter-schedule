import React from 'react';
import { generateDayArray } from '../../../utils/dateUtils';
import { AVAILABLE_SHIFTS } from '../../../constants/shifts';

const ScheduleView = ({ schedule, users, activeMonth, title = "Cədvəl" }) => {
  const dayArray = generateDayArray(activeMonth);
  const operatorUsers = Object.values(users).filter(u => u.role === 'operator' || u.role === 'admin');

  const getShiftLabel = (value) => {
    const shift = AVAILABLE_SHIFTS.find(s => s.value === value);
    return shift ? shift.label : value;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-600">
      <h3 className="text-2xl font-semibold mb-4 text-red-700">{title} - {activeMonth}</h3>
      
      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 w-48">
                Operator
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                OFF/M
              </th>
              {dayArray.map(day => (
                <th key={day} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {operatorUsers.map(user => {
              const assignment = schedule.userAssignments?.[user.uid] || { shifts: {}, offCount: 0 };

              return (
                <tr key={user.uid}>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white border-r w-48">
                    {user.name} {user.surname}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-bold text-red-600 w-16">
                    {assignment.offCount}
                  </td>
                  {dayArray.map(day => (
                    <td 
                      key={`${user.uid}-${day}`} 
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
      
      {operatorUsers.length === 0 && (
        <p className="text-center text-gray-500 mt-4">Hələ heç bir istifadəçi qeydiyyatdan keçməyib.</p>
      )}
    </div>
  );
};

export default ScheduleView;