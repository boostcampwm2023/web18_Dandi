import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { DiariesRepository } from './diaries.repository';
import {
  CreateDiaryDto,
  FeedDiaryDto,
  GetAllEmotionsRequestDto,
  GetYearMoodResponseDto,
  GetAllEmotionsResponseDto,
  ReadUserDiariesRequestDto,
  UpdateDiaryDto,
  AllDiaryInfosDto,
  GetDiaryResponseDto,
  ReadUserDiariesResponseDto,
} from './dto/diary.dto';
import { User } from 'src/users/entity/user.entity';
import { TagsService } from 'src/tags/tags.service';
import { DiaryStatus } from './entity/diaryStatus';
import { Diary } from './entity/diary.entity';
import { plainToClass } from 'class-transformer';
import {
  SENTIMENT_CHUNK_SIZE,
  CLOVA_SENTIMENT_URL,
  SUMMARY_MAX_SENTENCE_LENGTH,
  CLOVA_SUMMARY_URL,
  MoodDegree,
  MoodType,
  SUMMARY_MINIMUM_SENTENCE_LENGTH,
} from './utils/diaries.constant';
import { FriendsService } from 'src/friends/friends.service';
import { TimeUnit } from './dto/timeUnit.enum';
import { UsersService } from 'src/users/users.service';
import { addDays, parseISO, subMonths, subYears } from 'date-fns';
import { load } from 'cheerio';

@Injectable()
export class DiariesService {
  constructor(
    private readonly diariesRepository: DiariesRepository,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    private readonly friendsService: FriendsService,
  ) {}

  async saveDiary(user: User, createDiaryDto: CreateDiaryDto) {
    const tags = await this.tagsService.mapTagNameToTagType(createDiaryDto.tagNames);
    this.tagsService.updateDataSetScore(user.id, createDiaryDto.tagNames);

    const diary = plainToClass(Diary, createDiaryDto, {
      excludePrefixes: ['tag'],
    });
    const plainText = load(diary.content).text();

    diary.author = user;
    diary.tags = tags;
    diary.summary = await this.getSummary(diary.title, plainText);
    diary.mood = await this.judgeOverallMood(plainText);

    const savedDiary = await this.diariesRepository.save(diary);
    await this.diariesRepository.addDiaryEvent(savedDiary.id);
  }

  async findDiaryDetail(user: User, id: number) {
    const diary = await this.diariesRepository.findDiaryDetailById(id);

    this.existsDiary(diary);
    this.checkAuthorization(diary.userId, user.id, diary.status);

    return diary;
  }

  async findDiary(user: User, id: number) {
    const diary = await this.diariesRepository.findById(id);

    this.existsDiary(diary);
    this.checkAuthorization(diary.author.id, user.id, diary.status);

    return diary;
  }

  async updateDiary(diaryId: number, user: User, updateDiaryDto: UpdateDiaryDto) {
    const existingDiary = await this.findDiary(user, diaryId);

    existingDiary.tags = await this.tagsService.mapTagNameToTagType(updateDiaryDto.tagNames);
    this.tagsService.updateDataSetScore(user.id, updateDiaryDto.tagNames);

    Object.keys(updateDiaryDto).forEach((key) => {
      if (updateDiaryDto[key]) {
        existingDiary[key] = updateDiaryDto[key];
      }
    });

    if (updateDiaryDto.content) {
      const plainText = load(updateDiaryDto.content).text();
      existingDiary.summary = await this.getSummary(existingDiary.title, plainText);
      existingDiary.mood = await this.judgeOverallMood(plainText);
    }

    await this.diariesRepository.save(existingDiary);
    await this.diariesRepository.addDiaryEvent(diaryId);
  }

  async deleteDiary(user: User, diaryId: number) {
    await this.findDiary(user, diaryId);

    await this.diariesRepository.softDelete(diaryId);
    await this.diariesRepository.addDiaryEvent(diaryId);
  }

  async findAllDiaryEmotions(
    user: User,
    userId: number,
    getAllEmotionsDto: GetAllEmotionsRequestDto,
  ) {
    let { startDate, lastDate } = getAllEmotionsDto;
    if (!getAllEmotionsDto.startDate || !getAllEmotionsDto.lastDate) {
      const currentDate = new Date();

      startDate = subMonths(currentDate, 1).toLocaleDateString();
      lastDate = addDays(currentDate, 1).toLocaleDateString();
    }

    return await this.diariesRepository.findAllDiaryBetweenDates(
      userId,
      user.id === userId,
      startDate,
      lastDate,
    );
  }

  async findFeedDiary(userId: number, lastIndex: number | undefined): Promise<FeedDiaryDto[]> {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const friends = await this.friendsService.getFriendsList(userId);

    if (friends.length === 0) {
      return [];
    }

    const friendsIdList = friends.map((friend) => friend.id);

    return await this.diariesRepository.findPaginatedDiaryByDateAndIdList(
      userId,
      oneWeekAgo,
      friendsIdList,
      lastIndex,
    );
  }

  async findDiaryByAuthorId(
    user: User,
    id: number,
    requestDto: ReadUserDiariesRequestDto,
  ): Promise<ReadUserDiariesResponseDto> {
    const author = await this.usersService.findUserById(id);

    let diaries: AllDiaryInfosDto[];
    if (requestDto.type === TimeUnit.Day) {
      diaries = await this.diariesRepository.findDiariesByAuthorIdWithPagination(
        id,
        user.id,
        requestDto.lastIndex,
      );
    } else {
      const endDate = addDays(parseISO(requestDto.endDate), 1);
      diaries = await this.diariesRepository.findDiariesByAuthorIdWithDates(
        id,
        user.id,
        requestDto.startDate,
        endDate,
      );
    }

    return { nickname: author.nickname, diaryList: diaries };
  }

  async getMoodForYear(userId: number): Promise<GetYearMoodResponseDto[]> {
    const oneYearAgo = subYears(new Date(), 1);
    const nextDay = addDays(new Date(), 1);

    return await this.diariesRepository.findLatestDiaryByDate(userId, oneYearAgo, nextDay);
  }

  async findDiaryByKeywordV1(
    user: User,
    keyword: string,
    lastIndex: number,
  ): Promise<ReadUserDiariesResponseDto> {
    const diaries = await this.diariesRepository.findDiaryByKeywordV1(user.id, keyword, lastIndex);

    return { nickname: user.nickname, diaryList: diaries };
  }

  async findDiaryByKeywordV2(user: User, keyword: string, lastIndex: number) {
    const diaries = await this.diariesRepository.findDiaryByKeywordV2(user.id, keyword, lastIndex);

    return { nickname: user.nickname, diaryList: diaries };
  }

  async findDiaryByTag(
    user: User,
    tagName: string,
    lastIndex: number | undefined,
  ): Promise<ReadUserDiariesResponseDto> {
    const diaries = await this.diariesRepository.findDiaryByTag(user.id, tagName, lastIndex);

    return { nickname: user.nickname, diaryList: diaries };
  }

  async findDiaryByKeywordV3(user: User, keyword: string, lastIndex: number) {
    const diaries = await this.diariesRepository.findDiaryByKeywordV3(user.id, keyword, lastIndex);

    return diaries.map<AllDiaryInfosDto>((diary) => {
      const reactionIndex = diary.reactionUsers.findIndex(
        (reactionUserId) => reactionUserId === user.id,
      );

      return {
        diaryId: diary.diaryid,
        thumbnail: diary.thumbnail,
        title: diary.title,
        summary: diary.summary,
        tags: diary.tagnames ?? [],
        emotion: diary.emotion,
        reactionCount: diary.reactions.length,
        createdAt: diary.createdat,
        leavedReaction: reactionIndex !== -1 ? diary.reactions[reactionIndex] : null,
      };
    });
  }

  private existsDiary(diary: Diary | GetDiaryResponseDto) {
    if (!diary) {
      throw new BadRequestException('존재하지 않는 일기입니다.');
    }
  }

  private checkAuthorization(authorId: number, userId: number, status: DiaryStatus) {
    if (status === DiaryStatus.PRIVATE && authorId !== userId) {
      throw new ForbiddenException('권한이 없는 사용자입니다.');
    }
  }

  private async getSummary(title: string, plainText: string) {
    if (this.isShortContent(plainText)) {
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
  }

  private isShortContent(content: string) {
    const sentences = content.split(/[.!?]/).filter((sentence) => sentence.trim() !== '');

    return sentences.length <= SUMMARY_MINIMUM_SENTENCE_LENGTH;
  }

  private async judgeOverallMood(plainText: string) {
    const [statistics, totalNumber] = await this.sumMoodAnalysis(plainText);

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
  }

  private async sumMoodAnalysis(plainText: string): Promise<[Record<string, number>, number]> {
    const numberOfChunk = Math.floor(plainText.length / SENTIMENT_CHUNK_SIZE) + 1;
    const moodStatistics = {
      [MoodType.POSITIVE]: 0,
      [MoodType.NEGATIVE]: 0,
      [MoodType.NEUTRAL]: 0,
    };

    for (let start = 0; start < plainText.length; start += SENTIMENT_CHUNK_SIZE) {
      const analysis = await this.analyzeMood(plainText.slice(start, start + SENTIMENT_CHUNK_SIZE));

      Object.keys(analysis).forEach((key) => (moodStatistics[key] += analysis[key]));
    }
    return [moodStatistics, numberOfChunk];
  }

  private async analyzeMood(content: string): Promise<Record<string, number>> {
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
  }
}
