export const CLOVA_SENTIMENT_URL =
  'https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze';

export const ITEM_PER_PAGE = 5;

export enum MoodType {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
}

export enum MoodDegree {
  BAD = 1,
  SO_BAD = 2,
  SO_SO = 3,
  GOOD = 4,
  SO_GOOD = 5,
}
