import React from 'react';
import { generateDayArray } from '../../../utils/dateUtils';
import ShiftCell from './ShiftCell';

const ScheduleTable = ({ schedule, users, activeMonth, onShiftChange, editable = false }) => {
  const dayArray = generateDayArray(activeMonth);
  const operatorUsers = Object.values(users).filter(u => u.role === 'operator' || u.role === 'admin');

  return (
    <div className="overflow-x-auto">
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
                  <ShiftCell
                    key={`${user.uid}-${day}`}
                    shift={assignment.shifts[day]}
                    day={day}
                    userId={user.uid}
                    editable={editable}
                    onShiftChange={onShiftChange}
                  />
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;