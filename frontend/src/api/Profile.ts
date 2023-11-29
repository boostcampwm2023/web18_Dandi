import API_PATH from '@util/apiPath';

export const getCurrentUser = async (userId: number) => {
  try {
    const response = await fetch(API_PATH.USER.userProfile(userId), {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('현재 로그인 중인 유저 정보 조회에 실패했습니다.', error);
  }
};
