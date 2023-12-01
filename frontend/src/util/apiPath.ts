const SERVER_URL = 'http://223.130.146.253:3000';
// const SERVER_URL = 'http://localhost:3000';

const AUTH = '/auth';
const USER = '/users';
const DIARY = '/diaries';
const REACTION = '/reactions';
const FRIEND = '/friends';
const TAG = '/tags';

const API_PATH = {
  AUTH: {
    login: () => SERVER_URL + AUTH + '/login',
    logout: () => SERVER_URL + AUTH + '/logout',
    updateToken: () => SERVER_URL + AUTH + '/refresh_token',
  },
  USER: {
    userProfile: (id: number) => SERVER_URL + USER + `/${id}`,
    searchUser: (nickname: string) => SERVER_URL + USER + '/search' + `/${nickname}`,
    updateUserProfile: () => SERVER_URL + USER + '/profile',
  },
  DIARY: {
    rud: (id: number) => SERVER_URL + DIARY + `/${id}`,
    search: (keyword: string) => SERVER_URL + DIARY + '/search' + `/${keyword}`,
    keywordSearch: (keyword: string) => SERVER_URL + DIARY + TAG + `/${keyword}`,
    feed: (lastIndex: number) => SERVER_URL + DIARY + `/friends?lastIndex=${lastIndex}`,
    grass: (id: number) => SERVER_URL + DIARY + '/mood' + `/${id}`,
    emotion: (id: number, startDate: number, lastDate: number) =>
      SERVER_URL + DIARY + '/emotion' + `/${id}` + `?startDate=${startDate}&lastDate=${lastDate}`,
    myDiary: (id: number, type: string, startDate: number, endDate: number, lastIndex: number) =>
      SERVER_URL +
      DIARY +
      USER +
      `${id}?type=${type}&startDate=${startDate}&endDate=${endDate}&lastIndex=${lastIndex}`,
    create: () => SERVER_URL + DIARY,
  },
  REACTION: {
    crud: (id: number) => SERVER_URL + REACTION + `/${id}`,
  },
  FRIEND: {
    search: (nickname: string) => SERVER_URL + FRIEND + '/search' + `/${nickname}`,
    list: (userId: number) => SERVER_URL + FRIEND + `/${userId}`,
    request: (userId: number) => SERVER_URL + FRIEND + '/request' + `/${userId}`,
    send: (receiverId: number) => SERVER_URL + FRIEND + `/${receiverId}`,
    received: (senderId: number) => SERVER_URL + '/allow' + `/${senderId}`,
  },
  TAG: {
    recommend: (keyword: string) => SERVER_URL + TAG + '/search' + `/${keyword}`,
  },
};

export default API_PATH;
