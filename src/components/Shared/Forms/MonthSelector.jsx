import React from 'react';

const MonthSelector = ({ value, onChange, className = '' }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className={className}>
      <label htmlFor="month-selector" className="block text-sm font-medium text-gray-700 mb-2">
        Ay Seçin
      </label>
      <input
        id="month-selector"
        type="month"
        value={value}
        onChange={onChange}
        min={`${currentYear - 1}-01`}
        max={`${currentYear + 2}-12`}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
      />
    </div>
  );
};

export default MonthSelector;