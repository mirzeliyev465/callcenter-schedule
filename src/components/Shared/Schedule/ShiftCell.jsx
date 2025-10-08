import React from 'react';
import { AVAILABLE_SHIFTS, SHIFT_COLORS } from '../../../constants/shifts';

const ShiftCell = ({ shift, day, userId, editable = false, onShiftChange }) => {
  const handleChange = (e) => {
    if (onShiftChange) {
      onShiftChange(userId, day.toString(), e.target.value);
    }
  };

  const getShiftColor = (shiftValue) => {
    return SHIFT_COLORS[shiftValue] || SHIFT_COLORS.default;
  };

  if (editable) {
    return (
      <td className="p-1 text-center border border-gray-100">
        <select
          value={shift || ''}
          onChange={handleChange}
          className={`w-full p-2 text-xs border rounded-lg focus:ring-blue-500 focus:border-blue-500 font-semibold ${getShiftColor(shift)}`}
        >
          {AVAILABLE_SHIFTS.map(shiftOption => (
            <option key={shiftOption.value} value={shiftOption.value}>
              {shiftOption.label}
            </option>
          ))}
        </select>
      </td>
    );
  }

  return (
    <td className={`px-2 py-1 text-center text-xs border border-gray-100 font-semibold ${getShiftColor(shift)}`}>
      {shift || '-'}
    </td>
  );
};

export default ShiftCell;