// src/utils/demoData.js

export const demoUsers = [
  { id: 1, name: 'Fərid', role: 'admin', email: 'ferid@example.com' },
  { id: 2, name: 'Günay', role: 'operator', email: 'gunay@example.com' },
  { id: 3, name: 'Əli', role: 'operator', email: 'ali@example.com' },
  { id: 4, name: 'Aygün', role: 'operator', email: 'aygun@example.com' },
  { id: 5, name: 'Rəşad', role: 'operator', email: 'resad@example.com' }
];

export const demoSchedules = [
  { id: 1, date: '2024-01-15', shift: '9-5', operatorId: 2 },
  { id: 2, date: '2024-01-15', shift: '10-6', operatorId: 3 },
  { id: 3, date: '2024-01-15', shift: '11-7', operatorId: 4 },
  { id: 4, date: '2024-01-16', shift: '12-8', operatorId: 2 },
  { id: 5, date: '2024-01-16', shift: '1-9', operatorId: 3 },
  { id: 6, date: '2024-01-17', shift: '9-6', operatorId: 4 },
  { id: 7, date: '2024-01-17', shift: '10-7', operatorId: 5 }
];

export const demoShifts = [
  { 
    value: '9-5', 
    label: 'Səhər Növbəsi (09:00-17:00)', 
    color: 'blue',
    start: 9,
    end: 17
  },
  { 
    value: '10-6', 
    label: 'Gündüz Növbəsi (10:00-18:00)', 
    color: 'green',
    start: 10,
    end: 18
  },
  { 
    value: '11-7', 
    label: 'Günorta Növbəsi (11:00-19:00)', 
    color: 'yellow',
    start: 11,
    end: 19
  },
  { 
    value: '12-8', 
    label: 'Axşamüstü Növbəsi (12:00-20:00)', 
    color: 'orange',
    start: 12,
    end: 20
  },
  { 
    value: '1-9', 
    label: 'Axşam Növbəsi (13:00-21:00)', 
    color: 'red',
    start: 13,
    end: 21
  },
  { 
    value: '9-6', 
    label: 'Tam Gün Növbəsi (09:00-18:00)', 
    color: 'purple',
    start: 9,
    end: 18
  },
  { 
    value: '10-7', 
    label: 'Uzadılmış Növbə (10:00-19:00)', 
    color: 'indigo',
    start: 10,
    end: 19
  }
];

// initializeDemoData funksiyası
export const initializeDemoData = async (db, appId) => {
  try {
    console.log("Demo məlumatlar yüklənir...");
    
    console.log("Demo istifadəçilər:", demoUsers);
    console.log("Demo növbələr:", demoShifts);
    console.log("Demo cədvəl:", demoSchedules);
    
    return { 
      success: true, 
      users: demoUsers, 
      schedules: demoSchedules,
      shifts: demoShifts 
    };
  } catch (error) {
    console.error("Demo məlumatlar yüklənərkən xəta:", error);
    return { success: false, error: error.message };
  }
};

// Alternativ - sadə versiya
export const initializeDemoDataSimple = () => {
  console.log("Demo məlumatlar işə salınır...");
  return {
    users: demoUsers,
    schedules: demoSchedules,
    shifts: demoShifts
  };
};

// Növbə rəngləri üçün helper funksiya
export const getShiftColor = (shiftValue) => {
  const shift = demoShifts.find(s => s.value === shiftValue);
  return shift?.color || 'gray';
};

// Növbə məlumatını almaq üçün helper funksiya
export const getShiftInfo = (shiftValue) => {
  return demoShifts.find(s => s.value === shiftValue) || { label: shiftValue, color: 'gray' };
};
// src/utils/demoData.js

export const demoUsers = [
  { id: 1, name: 'Fərid', role: 'admin', email: 'ferid@example.com' },
  { id: 2, name: 'Günay', role: 'operator', email: 'gunay@example.com' },
  { id: 3, name: 'Əli', role: 'operator', email: 'ali@example.com' },
  { id: 4, name: 'Aygün', role: 'operator', email: 'aygun@example.com' },
  { id: 5, name: 'Rəşad', role: 'operator', email: 'resad@example.com' }
];

export const demoSchedules = [
  { id: 1, date: '2024-01-15', shift: '9-5', operatorId: 2 },
  { id: 2, date: '2024-01-15', shift: '10-6', operatorId: 3 },
  { id: 3, date: '2024-01-15', shift: '11-7', operatorId: 4 },
  { id: 4, date: '2024-01-16', shift: '12-8', operatorId: 2 },
  { id: 5, date: '2024-01-16', shift: '1-9', operatorId: 3 },
  { id: 6, date: '2024-01-17', shift: '9-6', operatorId: 4 },
  { id: 7, date: '2024-01-17', shift: '10-7', operatorId: 5 }
];

export const demoShifts = [
  { 
    value: '9-5', 
    label: 'Səhər Növbəsi (09:00-17:00)', 
    color: 'blue',
    start: 9,
    end: 17
  },
  { 
    value: '10-6', 
    label: 'Gündüz Növbəsi (10:00-18:00)', 
    color: 'green',
    start: 10,
    end: 18
  },
  { 
    value: '11-7', 
    label: 'Günorta Növbəsi (11:00-19:00)', 
    color: 'yellow',
    start: 11,
    end: 19
  },
  { 
    value: '12-8', 
    label: 'Axşamüstü Növbəsi (12:00-20:00)', 
    color: 'orange',
    start: 12,
    end: 20
  },
  { 
    value: '1-9', 
    label: 'Axşam Növbəsi (13:00-21:00)', 
    color: 'red',
    start: 13,
    end: 21
  },
  { 
    value: '9-6', 
    label: 'Tam Gün Növbəsi (09:00-18:00)', 
    color: 'purple',
    start: 9,
    end: 18
  },
  { 
    value: '10-7', 
    label: 'Uzadılmış Növbə (10:00-19:00)', 
    color: 'indigo',
    start: 10,
    end: 19
  }
];

// initializeDemoData funksiyası
export const initializeDemoData = async (db, appId) => {
  try {
    console.log("Demo məlumatlar yüklənir...");
    
    console.log("Demo istifadəçilər:", demoUsers);
    console.log("Demo növbələr:", demoShifts);
    console.log("Demo cədvəl:", demoSchedules);
    
    return { 
      success: true, 
      users: demoUsers, 
      schedules: demoSchedules,
      shifts: demoShifts 
    };
  } catch (error) {
    console.error("Demo məlumatlar yüklənərkən xəta:", error);
    return { success: false, error: error.message };
  }
};

// Növbə rəngləri üçün helper funksiya
export const getShiftColor = (shiftValue) => {
  const shift = demoShifts.find(s => s.value === shiftValue);
  return shift?.color || 'gray';
};

// Növbə məlumatını almaq üçün helper funksiya
export const getShiftInfo = (shiftValue) => {
  return demoShifts.find(s => s.value === shiftValue) || { label: shiftValue, color: 'gray' };
};