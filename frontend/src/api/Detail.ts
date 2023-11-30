import API_PATH from '@util/apiPath';

export const referDiary = async (diaryId: number) => {
  try {
    const response = await fetch(API_PATH.DIARY.rud(diaryId), {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP 에러 상태: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteDiary = async (diaryId: number) => {
  try {
    const response = await fetch(API_PATH.DIARY.rud(diaryId), {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
  } catch (error) {
    console.error(error);
    throw error;
  }
};
