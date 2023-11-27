import { viewTypes } from '@type/pages/MyDiary';

export const DAY_OF_WEEK = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
export const DUMMY_DATA = [
  {
    createdAt: '2023-11-13T13:50:17.106Z',
    profileImage: '',
    nickname: '단디',
    thumbnail:
      'https://cdn.inflearn.com/public/files/pages/38c3fb10-72a4-4ea5-8361-4ee6b682e188/SVG.jpg',
    title: '첫번째',
    content: `일기내용입니다.\n일기내용입니다.\n세 번째 줄까지만 보입니다다다다다다다다다다다다다다다다다다다다`,
    keywords: ['키워드1', '키워드2', '키워드3', '키워드4'],
    reactionCount: 1000,
    authorId: 1,
    diaryId: 1,
  },
  {
    createdAt: '2023-11-13T13:50:17.106Z',
    profileImage: '',
    nickname: '단디',
    thumbnail:
      'https://mblogthumb-phinf.pstatic.net/MjAyMzA1MDZfMjg2/MDAxNjgzMzY5MzE1MTky.eVMofWydN_T-5Cn227nrfcdyPVzpHRN2jaJXGLeVyUUg.S_l9nnV4ANRX4t9isjrt5rbUd8iWyM8D8w6yJMcPktEg.PNG.withwithpet/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2023-05-06_%EC%98%A4%ED%9B%84_7.25.06.png?type=w800',
    title: '두번째',
    content:
      '일기내용입니다.\n일기내용입니다.\n세 번째 줄까지만 보입니다다다다다다다다다다다다다다다다다다다다',
    keywords: ['키워드1', '키워드2', '키워드3', '키워드4'],
    reactionCount: 10,
    authorId: 1,
    diaryId: 1,
  },
  {
    createdAt: '2023-11-13T13:50:17.106Z',
    profileImage: '',
    nickname: '단디',
    thumbnail:
      'https://cdn.inflearn.com/public/files/pages/6bb907b6-56b8-49c0-8e1c-7103f2b8aa11/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8%EC%9D%98%20%EC%99%84%EC%84%B1%20%EA%B3%BC%EC%A0%95.png',
    title: '마지막',
    content:
      '일기내용입니다.\n일기내용입니다.\n세 번째 줄까지만 보입니다다다다다다다다다다다다다다다다다다다다',
    keywords: ['키워드1', '키워드2', '키워드3', '키워드4'],
    reactionCount: 10,
    authorId: 1,
    diaryId: 1,
  },
];

export const NEXT_INDEX = 1;
export const PREV_INDEX = -1;
export const PAGE_TITLE_HOME = '님의 일기 목록';
export const PAGE_TITLE_FEED = '친구들의 일기';
export const HOME = 'home';
export const FEED = 'feed';
export const DEFAULT = 'default';
export const LARGE = 'large';
export const SMALL = 'small';
export const DEFAULT_VIEWBOX_WIDTH = 24;
export const DEFAULT_VIEWBOX_HEIGHT = 24;
export const LARGE_VIEWBOX_WIDTH = 95;
export const LARGE_VIEWBOX_HEIGHT = 82;
export const PROFILE_BUTTON_TYPE = {
  LIST: 'list',
  RECEIVED: 'received',
  SEND: 'send',
};
export const PROFILE_MODAL_CONTENT_TYPE = {
  LIST: 'list',
  REQUEST: 'request',
  EDIT: 'edit',
};
export const GREET_MESSAGES = ['좋은 하루예요!', '안녕하세요!', '반가워요!'];
export const TEXT_ABOUT_EXISTED_TODAY = {
  true: {
    buttonText: '오늘 하루 보러 가기',
    noticeText: ['오늘 일기를 작성하셨네요!', '작성하신 일기를 보여드릴게요.'],
  },
  false: {
    buttonText: '오늘 하루 기록하기',
    noticeText: ['아직 오늘 일기를 작성하지 않으셨네요!', '일기를 작성해볼까요?'],
  },
};
export const START_INDEX = 0;
export const WEEK_INDEX = 7;
export const DIARY_VIEW_TYPE_LIST: viewTypes[] = ['Day', 'Week', 'Month'];
export const DIARY_VIEW_TYPE = {
  DAY: 'Day',
  WEEK: 'Week',
  MONTH: 'Month',
};
export const WEEK_STANDARD_LENGTH = 3;
export const PAGE_URL = {
  HOME: '/',
  FEED: '/feed',
  EDIT: '/edit',
  MY_DIARY: '/my-diary',
  LOGIN: '/login',
  AUTH: '/auth',
  DETAIL: '/detail',
};
export const NAVER_LOGIN_FORM_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${
  import.meta.env.VITE_NAVER_CLIENT_ID
}&state=${import.meta.env.VITE_NAVER_CLIENT_SECRET}&redirect_uri=${
  import.meta.env.VITE_NAVER_CALLBACK_URL
}&scope=name,email,profile_imagse,nickname`;

export const SERVER_URL = 'http://223.130.146.253:3000/';
