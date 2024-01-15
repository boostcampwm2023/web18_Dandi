import {
  CLOVA_SENTIMENT_URL,
  CLOVA_SUMMARY_URL,
  MoodDegree,
  MoodType,
  SENTIMENT_CHUNK_SIZE,
  SUMMARY_MAX_SENTENCE_LENGTH,
  SUMMARY_MINIMUM_SENTENCE_LENGTH,
} from './diaries.constant';

export const getSummary = async (title: string, plainText: string) => {
  if (isShortContent(plainText)) {
    return plainText;
  }
  plainText = plainText.substring(0, SUMMARY_MAX_SENTENCE_LENGTH);

  const response = await fetch(CLOVA_SUMMARY_URL, {
    method: 'POST',
    headers: {
      'X-NCP-APIGW-API-KEY-ID': process.env.NCP_CLOVA_SUMMARY_API_KEY_ID,
      'X-NCP-APIGW-API-KEY': process.env.NCP_CLOVA_SUMMARY_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      document: { title, content: plainText },
      option: { language: 'ko' },
    }),
  });

  const body = await response.json();
  return body.summary ?? plainText;
};

const isShortContent = (content: string) => {
  const sentences = content.split(/[.!?]/).filter((sentence) => sentence.trim() !== '');

  return sentences.length <= SUMMARY_MINIMUM_SENTENCE_LENGTH;
};

export const judgeOverallMood = async (plainText: string) => {
  const [statistics, totalNumber] = await sumMoodAnalysis(plainText);

  const [type, sum] = Object.entries(statistics).reduce((max, cur) => {
    return cur[1] > max[1] ? cur : max;
  });

  const figure = sum / totalNumber;
  switch (type) {
    case MoodType.POSITIVE:
      if (figure > 50) {
        return MoodDegree.SO_GOOD;
      }
      return MoodDegree.GOOD;
    case MoodType.NEGATIVE:
      if (figure > 50) {
        return MoodDegree.SO_BAD;
      }
      return MoodDegree.BAD;
    default:
      return MoodDegree.SO_SO;
  }
};

const sumMoodAnalysis = async (plainText: string): Promise<[Record<string, number>, number]> => {
  const numberOfChunk = Math.floor(plainText.length / SENTIMENT_CHUNK_SIZE) + 1;
  const moodStatistics = {
    [MoodType.POSITIVE]: 0,
    [MoodType.NEGATIVE]: 0,
    [MoodType.NEUTRAL]: 0,
  };

  for (let start = 0; start < plainText.length; start += SENTIMENT_CHUNK_SIZE) {
    const analysis = await analyzeMood(plainText.slice(start, start + SENTIMENT_CHUNK_SIZE));

    Object.keys(analysis).forEach((key) => (moodStatistics[key] += analysis[key]));
  }
  return [moodStatistics, numberOfChunk];
};

const analyzeMood = async (content: string): Promise<Record<string, number>> => {
  const response = await fetch(CLOVA_SENTIMENT_URL, {
    method: 'POST',
    headers: {
      'X-NCP-APIGW-API-KEY-ID': process.env.NCP_CLOVA_SENTIMENT_API_KEY_ID,
      'X-NCP-APIGW-API-KEY': process.env.NCP_CLOVA_SENTIMENT_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  const jsonResponse = await response.json();

  return jsonResponse.document.confidence;
};
