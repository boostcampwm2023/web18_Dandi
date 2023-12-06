import API_PATH from '@util/apiPath';

import interceptor from '@api/fetchInterceptor';

const getEmotionStat = async (id: number, startDate: string, endDate: string) => {
  try {
    const response = await interceptor(API_PATH.DIARY.emotion(id, startDate, endDate), {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('감정 통계 조회에 실패했습니다.', error);
  }
};

export default getEmotionStat;
