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

export const getKeywordSearchResults = async ({
  pageParam,
}: {
  pageParam: { keywordList: string[]; lastIndex: number };
}) => {
  try {
    const { keywordList, lastIndex } = pageParam;

    const response = await fetch(API_PATH.DIARY.keywordSearch(keywordList, lastIndex), {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('검색 결과 조회에 실패했습니다.', error);
  }
};

export const getContentSearchResults = async ({
  pageParam,
}: {
  pageParam: { contentSearchItem: string; lastIndex: number };
}) => {
  try {
    const { contentSearchItem, lastIndex } = pageParam;

    const response = await fetch(API_PATH.DIARY.search(contentSearchItem, lastIndex), {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('검색 결과 조회에 실패했습니다.', error);
  }
};
