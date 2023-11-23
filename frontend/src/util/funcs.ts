import { DAY_OF_WEEK } from './constants';

export const getNowMonth = (date: Date) => {
  const month = date.getMonth() + 1;
  const monthName = date.toLocaleString('en-US', { month: 'long' });
  return [month, monthName];
};

export const getNowWeek = (date: Date) => {
  const year = date.getFullYear();
  const nowDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const firstDate = new Date(year, 0, 1);
  const diffDate = nowDate.getTime() - firstDate.getTime();
  const diffDay = diffDate / (1000 * 60 * 60 * 24);
  const nowWeek = Math.floor((diffDay + firstDate.getDay()) / 7) + 1;
  return nowWeek;
};

export const formatDate = (date: Date, type: 'dot' | 'kor') => {
  switch (type) {
    case 'dot':
      return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
    case 'kor':
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${
        DAY_OF_WEEK[date.getDay()]
      }`;
  }
};
