// Shift utility functions

// Shift configurations
export const SHIFT_TYPES = {
  '9-5': {
    label: '9-5 Smən',
    start: 9,
    end: 17,
    duration: 8,
    color: 'blue',
    description: 'Səhər növbəsi'
  },
  '9-6': {
    label: '9-6 Smən',
    start: 9,
    end: 18,
    duration: 9,
    color: 'green',
    description: 'Uzadılmış səhər növbəsi'
  },
  '10-6': {
    label: '10-6 Smən',
    start: 10,
    end: 18,
    duration: 8,
    color: 'yellow',
    description: 'Gündüz növbəsi'
  },
  '10-7': {
    label: '10-7 Smən',
    start: 10,
    end: 19,
    duration: 9,
    color: 'orange',
    description: 'Uzadılmış gündüz növbəsi'
  },
  '11-7': {
    label: '11-7 Smən',
    start: 11,
    end: 19,
    duration: 8,
    color: 'red',
    description: 'Günorta növbəsi'
  },
  '12-8': {
    label: '12-8 Smən',
    start: 12,
    end: 20,
    duration: 8,
    color: 'purple',
    description: 'Axşamüstü növbəsi'
  },
  '1-9': {
    label: '1-9 Smən',
    start: 13,
    end: 21,
    duration: 8,
    color: 'indigo',
    description: 'Axşam növbəsi'
  },
  'off': {
    label: 'Off Günü',
    start: null,
    end: null,
    duration: 0,
    color: 'gray',
    description: 'İstirahət günü'
  },
  'm': {
    label: 'Məzuniyyət (M)',
    start: null,
    end: null,
    duration: 0,
    color: 'pink',
    description: 'Məzuniyyət günü'
  }
};

// Get shift information by value
export const getShiftInfo = (shiftValue) => {
  return SHIFT_TYPES[shiftValue] || {
    label: shiftValue,
    start: null,
    end: null,
    duration: 0,
    color: 'gray',
    description: 'Naməlum növbə'
  };
};

// Get shift color class
export const getShiftColorClass = (shiftValue) => {
  const shift = getShiftInfo(shiftValue);
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
  return colorMap[shift.color] || colorMap.gray;
};

// Calculate shift duration in hours
export const calculateShiftDuration = (shiftValue) => {
  const shift = getShiftInfo(shiftValue);
  return shift.duration;
};

// Check if two shifts overlap
export const doShiftsOverlap = (shift1, shift2) => {
  const info1 = getShiftInfo(shift1);
  const info2 = getShiftInfo(shift2);
  
  // If either shift is off day or vacation, they don't overlap
  if (!info1.start || !info2.start) return false;
  
  return !(info1.end <= info2.start || info2.end <= info1.start);
};

// Get available shifts for a time slot
export const getAvailableShifts = (occupiedShifts = []) => {
  const allShifts = Object.keys(SHIFT_TYPES).filter(shift => 
    shift !== 'off' && shift !== 'm'
  );
  
  return allShifts.filter(shift => 
    !occupiedShifts.some(occupied => doShiftsOverlap(shift, occupied))
  );
};

// Validate shift assignment
export const validateShiftAssignment = (date, operatorId, shift, existingSchedules) => {
  const errors = [];
  
  // Check if operator already has a shift on this date
  const existingShift = existingSchedules.find(
    schedule => schedule.date === date && schedule.operatorId === operatorId
  );
  
  if (existingShift) {
    errors.push('Bu istifadəçinin bu tarixdə artıq növbəsi var');
  }
  
  // Check for shift conflicts with other operators
  const conflictingShifts = existingSchedules.filter(
    schedule => schedule.date === date && doShiftsOverlap(schedule.shift, shift)
  );
  
  if (conflictingShifts.length > 0) {
    errors.push('Bu smən üçün konflikt var');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate shift schedule for a month
export const generateMonthlySchedule = (year, month, schedules = []) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthlySchedule = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const daySchedules = schedules.filter(schedule => schedule.date === date);
    
    monthlySchedule.push({
      date,
      day,
      schedules: daySchedules,
      totalShifts: daySchedules.length,
      isWeekend: [0, 6].includes(new Date(year, month, day).getDay())
    });
  }
  
  return monthlySchedule;
};

// Calculate shift statistics
export const calculateShiftStats = (schedules = []) => {
  const stats = {
    totalShifts: schedules.length,
    shiftDistribution: {},
    userDistribution: {},
    dailyAverage: 0,
    mostPopularShift: null,
    busiestDay: null
  };
  
  // Calculate shift distribution
  schedules.forEach(schedule => {
    stats.shiftDistribution[schedule.shift] = (stats.shiftDistribution[schedule.shift] || 0) + 1;
    stats.userDistribution[schedule.operatorId] = (stats.userDistribution[schedule.operatorId] || 0) + 1;
  });
  
  // Calculate daily average
  const uniqueDates = [...new Set(schedules.map(s => s.date))];
  stats.dailyAverage = stats.totalShifts / (uniqueDates.length || 1);
  
  // Find most popular shift
  stats.mostPopularShift = Object.entries(stats.shiftDistribution)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || null;
  
  return stats;
};

// Format shift time for display
export const formatShiftTime = (shiftValue) => {
  const shift = getShiftInfo(shiftValue);
  if (!shift.start || !shift.end) return shift.label;
  
  return `${shift.start}:00 - ${shift.end}:00`;
};

// Get shift recommendations based on history
export const getShiftRecommendations = (userHistory = [], date) => {
  const userShifts = userHistory
    .filter(schedule => schedule.date !== date)
    .map(schedule => schedule.shift);
  
  // Simple recommendation: most frequent shift
  const shiftCounts = userShifts.reduce((acc, shift) => {
    acc[shift] = (acc[shift] || 0) + 1;
    return acc;
  }, {});
  
  const recommendedShift = Object.entries(shiftCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0];
  
  return {
    recommendedShift,
    confidence: userShifts.length > 0 ? (shiftCounts[recommendedShift] / userShifts.length) * 100 : 0,
    reason: userShifts.length > 0 
      ? `Bu smən istifadəçinin ən çox işlədiyi növbədir (${shiftCounts[recommendedShift]} dəfə)`
      : 'Kifayət qədər məlumat yoxdur'
  };
};

// Export shift data for different formats
export const exportShiftData = (schedules, format = 'json') => {
  const data = schedules.map(schedule => ({
    date: schedule.date,
    shift: schedule.shift,
    shiftLabel: getShiftInfo(schedule.shift).label,
    operatorId: schedule.operatorId,
    operatorName: schedule.operatorName,
    status: schedule.status || 'approved'
  }));
  
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);
      
    case 'csv':
      const headers = ['Date', 'Shift', 'Shift Label', 'Operator ID', 'Operator Name', 'Status'];
      const csv = [
        headers.join(','),
        ...data.map(row => [
          row.date,
          row.shift,
          `"${row.shiftLabel}"`,
          row.operatorId,
          `"${row.operatorName}"`,
          row.status
        ].join(','))
      ].join('\n');
      return csv;
      
    case 'excel':
      // This would typically use a library like xlsx
      return data;
      
    default:
      return data;
  }
};

// Calculate working hours for a period
export const calculateWorkingHours = (schedules, startDate, endDate) => {
  const relevantSchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.date);
    return scheduleDate >= new Date(startDate) && scheduleDate <= new Date(endDate);
  });
  
  return relevantSchedules.reduce((total, schedule) => {
    return total + calculateShiftDuration(schedule.shift);
  }, 0);
};

// Utility for shift color coding in calendars
export const getShiftCalendarProps = (shiftValue) => {
  const shift = getShiftInfo(shiftValue);
  
  const colorMap = {
    blue: { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600' },
    green: { bg: 'bg-green-500', text: 'text-white', border: 'border-green-600' },
    yellow: { bg: 'bg-yellow-500', text: 'text-gray-900', border: 'border-yellow-600' },
    orange: { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-600' },
    red: { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600' },
    purple: { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-600' },
    indigo: { bg: 'bg-indigo-500', text: 'text-white', border: 'border-indigo-600' },
    gray: { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-600' },
    pink: { bg: 'bg-pink-500', text: 'text-white', border: 'border-pink-600' }
  };
  
  return colorMap[shift.color] || colorMap.gray;
};

export default {
  SHIFT_TYPES,
  getShiftInfo,
  getShiftColorClass,
  calculateShiftDuration,
  doShiftsOverlap,
  getAvailableShifts,
  validateShiftAssignment,
  generateMonthlySchedule,
  calculateShiftStats,
  formatShiftTime,
  getShiftRecommendations,
  exportShiftData,
  calculateWorkingHours,
  getShiftCalendarProps
};