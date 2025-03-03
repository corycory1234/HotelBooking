const dayjs = require('dayjs');

// 1. 計算住幾晚
export default function how_Many_Nights(start_Date_Str: string, end_Date_Str: string) {
  const start_Date = dayjs(start_Date_Str);
  const end_Date = dayjs(end_Date_Str);
  const nights = end_Date.diff(start_Date, 'day');
  return nights;
};