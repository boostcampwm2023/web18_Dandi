import API_PATH from '@util/apiPath';

export const getFriendList = async (userId: number) => {
  try {
    const response = await fetch(API_PATH.FRIEND.list(userId), {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('친구목록 조회에 실패했습니다.', error);
  }
};
