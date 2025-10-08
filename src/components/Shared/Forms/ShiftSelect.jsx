import { AVAILABLE_SHIFTS } from '../../../constants/shifts';

const ShiftSelect = ({ value, onChange, className = '' }) => (
  <select
    value={value}
    onChange={onChange}
    className={`p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${className}`}
  >
    {AVAILABLE_SHIFTS.map(shift => (
      <option key={shift.value} value={shift.value}>
        {shift.label}
      </option>
    ))}
  </select>
);

export default ShiftSelect;