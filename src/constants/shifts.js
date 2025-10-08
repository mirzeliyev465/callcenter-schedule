export const AVAILABLE_SHIFTS = [
  { value: "", label: "Seçin" },
  { value: "9-5", label: "9:00 - 17:00" },
  { value: "9-6", label: "9:00 - 18:00" },
  { value: "10-7", label: "10:00 - 19:00" },
  { value: "10-6", label: "10:00 - 18:00" },
  { value: "11-7", label: "11:00 - 19:00" },
  { value: "12-8", label: "12:00 - 20:00" },
  { value: "1-9", label: "13:00 - 21:00" },
  { value: "M", label: "Məzuniyyət (M)" },
  { value: "OFF", label: "İstirahət (OFF)" }
];

export const SHIFT_COLORS = {
  'OFF': 'bg-green-100 text-green-700',
  'M': 'bg-red-200 text-red-800',
  '': 'bg-gray-50 text-gray-400',
  'default': 'bg-blue-100 text-blue-700'
};