export const getNowMonth = (date: Date) => {
  const month = date.getMonth() + 1;
  const monthName = date.toLocaleString('en-US', { month: 'long' });
  return [month, monthName];
};
