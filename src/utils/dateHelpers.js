# Date Helpers
cat > src/utils/dateHelpers.js << 'EOF'
export const getDaysInMonth = (monthString) => {
  const [year, month] = monthString.split('-').map(Number);
  return new Date(year, month, 0).getDate();
};

export const getDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const stopDate = new Date(endDate);
  
  while (currentDate <= stopDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
EOF