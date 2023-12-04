import { viewTypes } from '@type/pages/MyDiary';

import API_PATH from '@util/apiPath';

interface getDiaryListProps {
  userId: string;
  type: viewTypes;
}

interface getDiaryWeekAndMonthListProps extends getDiaryListProps {
  startDate: string;
  endDate: string;
}

export const getDiaryDayList = async ({
  pageParam,
}: {
  pageParam: { userId: string; type: viewTypes; lastIndex: number };
}) => {
  try {
    const { userId, type, lastIndex } = pageParam;
    const fetchUrl = lastIndex
      ? API_PATH.DIARY.myDiaryDay(userId, type, lastIndex)
      : API_PATH.DIARY.myDiaryDay(userId, type);
    const response = await fetch(fetchUrl, {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('일기 목록 조회에 실패했습니다.', error);
  }
};

export const getDiaryWeekAndMonthList = async (pageParam: getDiaryWeekAndMonthListProps) => {
  const { userId, type, startDate, endDate } = pageParam;
  try {
    const response = await fetch(
      API_PATH.DIARY.myDiaryWeekAndMonth(userId, type, startDate, endDate),
      {
        credentials: 'include',
      },
    );

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('일기 목록 조회에 실패했습니다.', error);
  }
};
