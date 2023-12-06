import API_PATH from '@util/apiPath';

import interceptor from '@api/fetchInterceptor';

export const getFeed = async ({ pageParam }: { pageParam: { lastIndex: number } }) => {
  try {
    const { lastIndex } = pageParam;
    const response = await interceptor(API_PATH.DIARY.feed(lastIndex), {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('피드 조회에 실패했습니다.', error);
  }
};
