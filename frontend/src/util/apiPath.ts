const SERVER_URL = 'https://dandi-ary.site:3001';
// const SERVER_URL = 'http://localhost:3000';

const AUTH = '/auth';
const USER = '/users';
const DIARY = '/diaries';
const REACTION = '/reactions';
const FRIEND = '/friends';
const TAG = '/tags';
const IMAGE = '/images';

const API_PATH = {
  AUTH: {
    login: () => SERVER_URL + AUTH + '/login',
    logout: () => SERVER_URL + AUTH + '/logout',
    updateToken: () => SERVER_URL + AUTH + '/refresh_token',
  },
  USER: {
    profile: () => SERVER_URL + USER,
    userProfile: (id: number) => SERVER_URL + USER + `/${id}`,
    searchUser: (nickname: string) => SERVER_URL + USER + '/search' + `/${nickname}`,
    updateUserProfile: () => SERVER_URL + USER + '/profile',
  },
  DIARY: {
    rud: (id: number) => SERVER_URL + DIARY + `/${id}`,
    search: (keyword: string, lastIndex: number) =>
      SERVER_URL + DIARY + '/search/v3' + `/${keyword}` + `?lastIndex=${lastIndex}`,
    keywordSearch: (keyword: string[], lastIndex: number) =>
      SERVER_URL + DIARY + TAG + `/${keyword}` + `?lastIndex=${lastIndex}`,
    feed: (lastIndex: number) => SERVER_URL + DIARY + `/friends?lastIndex=${lastIndex}`,
    grass: (id: number) => SERVER_URL + DIARY + '/mood' + `/${id}`,
    emotion: (id: number, startDate: string, lastDate: string) =>
      SERVER_URL + DIARY + '/emotions' + `/${id}` + `?startDate=${startDate}&lastDate=${lastDate}`,
    myDiaryDay: (id: string, type: string, lastIndex?: number) =>
      SERVER_URL + DIARY + USER + `/${id}?type=${type}&lastIndex=${lastIndex}`,
    myDiaryWeekAndMonth: (id: string, type: string, startDate: string, endDate: string) =>
      SERVER_URL + DIARY + USER + `/${id}?type=${type}&startDate=${startDate}&endDate=${endDate}`,
    create: () => SERVER_URL + DIARY,
  },
  REACTION: {
    crud: (id: number) => SERVER_URL + REACTION + `/${id}`,
  },
  FRIEND: {
    search: (nickname: string) => SERVER_URL + FRIEND + '/search' + `/${nickname}`,
    list: (userId: number) => SERVER_URL + FRIEND + `/${userId}`,
    request: (userId: number) => SERVER_URL + FRIEND + '/request' + `/${userId}`,
    allow: (senderId: number) => SERVER_URL + FRIEND + '/allow' + `/${senderId}`,
  },
  TAG: {
    recommend: (keyword: string) => SERVER_URL + TAG + '/search' + `/${keyword}`,
  },
  IMAGE: {
    diary: () => SERVER_URL + IMAGE + DIARY,
  },
};

export default API_PATH;
