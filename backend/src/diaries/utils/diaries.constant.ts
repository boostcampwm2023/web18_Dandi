export const CLOVA_SENTIMENT_URL =
  'https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze';

export enum SentimentHeaders {
  NCP_API_ID = 'X-NCP-APIGW-API-KEY-ID',
  NCP_API_SECRET = 'X-NCP-APIGW-API-KEY',
}

export enum MoodDegree {
  '매우 부정' = 1,
  '부정' = 2,
  '보통' = 3,
  '긍정' = 4,
  '매우 긍정' = 5,
}
