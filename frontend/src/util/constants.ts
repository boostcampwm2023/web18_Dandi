import { viewTypes } from '@type/pages/MyDiary';

export const DAY_OF_WEEK = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
export const EMOTION_LEVELS = ['no', 'terrible', 'bad', 'soso', 'good', 'excellent'];

export const NEXT_INDEX = 1;
export const PREV_INDEX = -1;
export const PREV_WEEK = -7;
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
  STRANGER: 'stranger',
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
  NOT_FOUND: '/not/found',
};
export const NAVER_LOGIN_FORM_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${
  import.meta.env.VITE_NAVER_CLIENT_ID
}&state=${import.meta.env.VITE_NAVER_CLIENT_SECRET}&redirect_uri=${
  import.meta.env.VITE_NAVER_CALLBACK_URL
}&scope=name,email,profile_imagse,nickname`;

export const DEBOUNCE_TIME = 500;
export const CONTENT_SEARCH_MIN_LENGTH = 1;
export const SM = 640;

export const reactQueryKeys = {
  Diary: 'diary',
  Grass: 'grass',
  EmotionStat: 'emotionStat',
  DayDiaryList: 'dayDiaryList',
  MyDayDiaryList: 'myDayDiaryList',
  FeedDiaryList: 'feedDiaryList',
  ProfileData: 'profileData',
  SearchDataList: 'searchDataList',
  ReactionList: 'reactionList',
  FriendList: 'friendList',
  SendList: 'sendList',
  ReceivedList: 'receivedList',
  MonthDiaryData: 'monthDiaryData',
  MyWeekDiary: 'myWeekDiary',
}
