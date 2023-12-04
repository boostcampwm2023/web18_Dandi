import { searchOptionsType } from '@/types/pages/MyDiary';
import API_PATH from '@util/apiPath';

export const getTagRecommend = async (keyword: string) => {
  try {
    const response = await fetch(API_PATH.TAG.recommend(encodeURI(keyword)), {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('추천 태그 조회에 실패했습니다.', error);
  }
};

export const getSearchResults = async ({
  pageParam,
}: {
  pageParam: { keyword: string; lastIndex: number; type: searchOptionsType };
}) => {
  try {
    const { keyword, lastIndex, type } = pageParam;
    const fetchURL =
      type === '키워드'
        ? API_PATH.DIARY.keywordSearch(keyword, lastIndex)
        : API_PATH.DIARY.search(keyword, lastIndex);

    const response = await fetch(fetchURL, {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('검색 결과 조회에 실패했습니다.', error);
  }
};
