// src/utils/dateUtils.js

/**
 * Aylın günlərini generasiya edir
 */
 export function generateDayArray(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
}

/**
 * Tarixi formatlayır
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('tr-TR');
}

/**
 * Ay adını qaytarır
 */
export function getMonthName(monthIndex) {
  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
    'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
  ];
  return months[monthIndex];
}

/**
 * Həftə sonu olub-olmadığını yoxlayır
 */
export function isWeekend(date) {
  const day = new Date(date).getDay();
  return day === 0 || day === 6; // 0 = Bazar, 6 = Şənbə
}

/**
 * Tarix aralığı generasiya edir
 */
export function getDateRange(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}