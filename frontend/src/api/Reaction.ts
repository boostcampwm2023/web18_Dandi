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
    console.error('반응 불러오기에 실패했습니다.', error);
  }
};

export const postReaction = async (diaryId: number, reaction: string) => {
  try {
    const response = await fetch(API_PATH.REACTION.crud(diaryId), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ reaction }),
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('반응 보내기에 실패했습니다.', error);
  }
};

export const deleteReaction = async (diaryId: number, reaction: string) => {
  try {
    const response = await fetch(API_PATH.REACTION.crud(diaryId), {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ reaction }),
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('반응 삭제하기에 실패했습니다.', error);
  }
};
