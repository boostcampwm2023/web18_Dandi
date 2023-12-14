import { DAY_OF_WEEK } from '@util/constants';

export const getNowMonth = (date: Date) => {
  const koreaTime = new Date(date.toUTCString());
  const month = koreaTime.getMonth() + 1;
  const monthName = koreaTime.toLocaleString('en-US', { month: 'long' });
  return [month, monthName];
};

export const getNowWeek = (date: Date) => {
  const koreaTime = new Date(date.toUTCString());
  const year = koreaTime.getFullYear();
  const nowDate = new Date(koreaTime.getFullYear(), koreaTime.getMonth(), koreaTime.getDate());
  const firstDate = new Date(year, 0, 1);
  const diffDate = nowDate.getTime() - firstDate.getTime();
  const diffDay = diffDate / (1000 * 60 * 60 * 24);
  const nowWeek = Math.floor((diffDay + firstDate.getDay()) / 7) + 1;
  return nowWeek;
};

export const formatDate = (date: Date) => {
  const koreaTime = new Date(date.toUTCString());
  return koreaTime.toLocaleDateString().slice(0, -1);
};

export const formatDateString = (str: string) => {
  const koreaTime = getKorTime(str);
  const year = koreaTime.getFullYear();
  const month = koreaTime.getMonth() + 1;
  const day = koreaTime.getDate();
  const date = koreaTime.getDay();

  return `${year}년 ${month}월 ${day}일 ${DAY_OF_WEEK[date]}`;
};

export const formatDateDash = (date: Date) => {
  const koreaTime = new Date(date);
  const year = koreaTime.getFullYear();
  const month = (koreaTime.getMonth() + 1).toString().padStart(2, '0');
  const day = koreaTime.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const calPrev = (date: Date, num: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + num);
  return newDate;
};

const getKorTime = (date: string) => {
  const utcDate = new Date(date);
  return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
};
