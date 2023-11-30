import API_PATH from '@util/apiPath';

export const getReactionList = async (diaryId: number) => {
  try {
    const response = await fetch(API_PATH.REACTION.crud(diaryId), {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('일기 저장에 실패했습니다.', error);
  }
};
