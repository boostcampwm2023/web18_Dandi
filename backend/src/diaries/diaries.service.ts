import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { DiariesRepository } from './diaries.repository';
import {
  CreateDiaryDto,
  FeedDiaryDto,
  GetAllEmotionsRequestDto,
  getYearMoodResponseDto,
  GetAllEmotionsResponseDto,
  ReadUserDiariesRequestDto,
  UpdateDiaryDto,
  AllDiaryInfosDto,
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
import { subYears } from 'date-fns';
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
    const diary = plainToClass(Diary, createDiaryDto, {
      excludePrefixes: ['tag'],
    });
    const plainText = load(diary.content).text();

    diary.author = user;
    diary.tags = tags;
    diary.summary = await this.getSummary(diary.title, plainText);
    diary.mood = await this.judgeOverallMood(plainText);

    await this.diariesRepository.save(diary);
  }

  async findDiary(user: User, id: number) {
    const diary = await this.diariesRepository.findById(id);
    this.existsDiary(diary);

    const author = await diary.author;
    this.checkAuthorization(author, user, diary.status);

    return diary;
  }

  async updateDiary(id: number, user: User, updateDiaryDto: UpdateDiaryDto) {
    const existingDiary = await this.findDiary(user, id);

    existingDiary.tags = await this.tagsService.mapTagNameToTagType(updateDiaryDto.tagNames);
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

    return await this.diariesRepository.save(existingDiary);
  }

  async deleteDiary(user: User, id: number) {
    await this.findDiary(user, id);

    await this.diariesRepository.softDelete(id);
  }

  async findAllDiaryEmotions(
    user: User,
    userId: number,
    getAllEmotionsDto: GetAllEmotionsRequestDto,
  ) {
    let { startDate, lastDate } = getAllEmotionsDto;
    if (!getAllEmotionsDto.startDate || !getAllEmotionsDto.lastDate) {
      const currentDate = new Date();

      startDate = currentDate.toLocaleString();
      lastDate = currentDate.setMonth(currentDate.getMonth() + 1).toLocaleString();
    }

    const diaries = await this.diariesRepository.findAllDiaryBetweenDates(
      userId,
      user.id === userId,
      startDate,
      lastDate,
    );
    return this.groupDiariesByEmotion(diaries);
  }

  private groupDiariesByEmotion(diaries: Diary[]) {
    return diaries.reduce<GetAllEmotionsResponseDto[]>((acc, crr) => {
      const diaryInfo = {
        id: crr.id,
        title: crr.title,
        createdAt: crr.createdAt,
      };

      const existingEmotion = acc.find((e) => e.emotion === crr.emotion);
      if (existingEmotion) {
        existingEmotion.diaryInfos.push(diaryInfo);
      } else {
        acc.push({
          emotion: crr.emotion,
          diaryInfos: [diaryInfo],
        });
      }
      return acc;
    }, []);
  }

  async getFeedDiary(
    userId: number,
    lastIndex: number | undefined,
  ): Promise<[FeedDiaryDto[], number]> {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const friends = await this.friendsService.getFriendsList(userId);
    const friendsIdList = friends.map((friend) => friend.id);

    const diaries = await this.diariesRepository.findPaginatedDiaryByDateAndIdList(
      oneWeekAgo,
      friendsIdList,
      lastIndex,
    );

    const feedDiaryList = await Promise.all(
      diaries.map(async (diary) => {
        const author = await diary.author;
        const reactions = await diary.reactions;
        const tags = await diary.tags;

        const myReaction = reactions.find((reaction) => reaction.user.id === userId);

        return {
          diaryId: diary.id,
          authorId: diary.author.id,
          createdAt: diary.createdAt,
          profileImage: author.profileImage,
          nickname: author.nickname,
          thumbnail: diary.thumbnail,
          title: diary.title,
          summary: diary.summary,
          tags: tags.map((tag) => tag.name),
          reactionCount: reactions.length,
          leavedReaction: myReaction === undefined ? null : myReaction.reaction,
        };
      }),
    );

    if (diaries.length > 0) {
      lastIndex = diaries[0].id;
    }

    return [feedDiaryList, lastIndex];
  }

  async findDiaryByAuthorId(user: User, id: number, requestDto: ReadUserDiariesRequestDto) {
    const author = await this.usersService.findUserById(id);

    let diaries: Diary[];
    if (requestDto.type === TimeUnit.Day) {
      diaries = await this.diariesRepository.findDiariesByAuthorIdWithPagination(
        id,
        user.id === id,
        requestDto.lastIndex,
      );
    } else {
      diaries = await this.diariesRepository.findDiariesByAuthorIdWithDates(
        id,
        user.id === id,
        requestDto.startDate,
        requestDto.endDate,
      );
    }

    return { author, diaries };
  }

  async getMoodForYear(userId: number): Promise<getYearMoodResponseDto[]> {
    const oneYearAgo = subYears(new Date(), 1);

    const diariesForYear = await this.diariesRepository.findLatestDiaryByDate(userId, oneYearAgo);

    const yearMood: getYearMoodResponseDto[] = diariesForYear.reduce((acc, cur) => {
      return [...acc, { date: cur.createdAt, mood: cur.mood }];
    }, []);

    return yearMood;
  }

  async findDiaryByKeyword(author: User, keyword: string) {
    const diaries = await this.diariesRepository.findDiaryByKeyword(author.id, keyword);

    const diaryInfos = Promise.all(
      diaries.map<Promise<AllDiaryInfosDto>>(async (diary) => {
        const tags = await diary.tags;
        const reactions = await diary.reactions;

        return {
          diaryId: diary.id,
          title: diary.title,
          thumbnail: diary.thumbnail,
          summary: diary.summary,
          tags: tags.map((t) => t.name),
          emotion: diary.emotion,
          reactionCount: reactions.length,
          createdAt: diary.createdAt,
          leavedReaction: reactions.find((reaction) => reaction.user.id === author.id)?.reaction,
        };
      }),
    );

    return diaryInfos;
  }

  private existsDiary(diary: Diary) {
    if (!diary) {
      throw new BadRequestException('존재하지 않는 일기입니다.');
    }
  }

  private checkAuthorization(author: User, user: User, status: DiaryStatus) {
    if (status === DiaryStatus.PRIVATE && author.id !== user.id) {
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
