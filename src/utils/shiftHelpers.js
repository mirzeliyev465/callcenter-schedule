# Shift Helpers
cat > src/utils/shiftHelpers.js << 'EOF'
export const calculateOffDays = (shifts) => {
  return Object.values(shifts).filter(shift => 
    shift === 'OFF' || shift === 'M'
  ).length;
};

export const getShiftLabel = (shiftCode) => {
  const shifts = {
    '9-5': '🌅 9:00 - 17:00',
    '9-6': '🌞 9:00 - 18:00', 
    '10-7': '☀️ 10:00 - 19:00',
    '10-6': '🌤️ 10:00 - 18:00',
    '11-7': '🌇 11:00 - 19:00',
    '12-8': '🌆 12:00 - 20:00',
    '1-9': '🌃 13:00 - 21:00',
    'M': '🏖️ Məzuniyyət',
    'OFF': '💤 İstirahət'
  };
  return shifts[shiftCode] || shiftCode;
};
EOF