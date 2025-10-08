// src/utils/formatters.js
export const formatUserName = (user) => {
  if (!user) return 'Naməlum';
  return `${user.name} ${user.surname}`.trim();
};

export const formatRequestStatus = (status) => {
  const statusMap = {
      'Gözləmədə': { text: '⏳ Gözləmədə', color: 'yellow' },
      'Təsdiqləndi': { text: '✅ Təsdiqləndi', color: 'green' },
      'Ləğv edildi': { text: '❌ Ləğv edildi', color: 'red' }
  };
  return statusMap[status] || { text: status, color: 'gray' };
};

export const formatMonthDisplay = (monthString) => {
  const [year, month] = monthString.split('-');
  const monthNames = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
      'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
  ];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};