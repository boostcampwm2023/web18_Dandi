export const CLOVA_SENTIMENT_URL =
  'https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze';
export const CLOVA_SUMMARY_URL = 'https://naveropenapi.apigw.ntruss.com/text-summary/v1/summarize';

export const SUMMARY_MINIMUM_SENTENCE_LENGTH = 3;
export const SUMMARY_MAX_SENTENCE_LENGTH = 2000;
export const SENTIMENT_CHUNK_SIZE = 1000;

export const IMG_TAG_REGEX = /<img[^>]*>/g;

export const ITEM_PER_PAGE = 5;
export const PAGINATION_SIZE = 5;

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
