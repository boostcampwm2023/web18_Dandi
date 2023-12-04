import { DAY_OF_WEEK } from '@util/constants';

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

export const formatDate = (date: Date) => date.toLocaleDateString().slice(0, -1);

export const formatDateString = (str: string) => {
  const DateObject = new Date(str);
  const year = DateObject.getFullYear();
  const month = DateObject.getMonth() + 1;
  const day = DateObject.getDate();
  const date = DateObject.getDay();

  return `${year}년 ${month}월 ${day}일 ${DAY_OF_WEEK[date]}`;
};

export const formatDateDash = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};
