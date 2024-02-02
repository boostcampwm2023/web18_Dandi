import { refresh } from '@api/Login';

import { PAGE_URL } from '@util/constants';

const interceptor = async (url: string, option: any) => {
  let response = await fetch(url, option);

  if (response.status !== 401) return response;

  const refreshResponse = await refresh();

  if (refreshResponse?.status === 401 || refreshResponse?.status === 500) {
    console.log('asdf')
    window.location.href = PAGE_URL.LOGIN;
    return refreshResponse;
  }

  response = await fetch(url, option);
  return response;
};

export default interceptor;
