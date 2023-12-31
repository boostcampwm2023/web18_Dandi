import API_PATH from '@util/apiPath';

import interceptor from '@api/fetchInterceptor';

const getGrass = async (userId: number) => {
  try {
    const response = await interceptor(API_PATH.DIARY.grass(userId), {
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

export default getGrass;
