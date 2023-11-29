import API_PATH from '@util/apiPath';

interface CreateDiaryParams {
  title: string;
  content: string;
  thumbnail?: string;
  emotion: string;
  tags?: string[];
  status: string;
}

export const createDiary = async (params: CreateDiaryParams) => {
  try {
    const response = await fetch(API_PATH.DIARY.create(), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ ...params }),
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
  } catch (error) {
    console.error('일기 저장에 실패했습니다.', error);
  }
};
