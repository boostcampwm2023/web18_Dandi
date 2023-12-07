import { DataSource, Repository } from 'typeorm';
import { Diary } from './entity/diary.entity';
import { Injectable } from '@nestjs/common';
import { DiaryStatus } from './entity/diaryStatus';
import { MoodDegree, PAGINATION_SIZE } from './utils/diaries.constant';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  AllDiaryInfosDto,
  GetAllEmotionsResponseDto,
  GetDiaryResponseDto,
  GetYearMoodResponseDto,
  SearchDiaryDataForm,
} from './dto/diary.dto';
import { startOfDay, endOfDay } from 'date-fns';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

@Injectable()
export class DiariesRepository extends Repository<Diary> {
  constructor(
    private dataSource: DataSource,
    private readonly elasticsearchService: ElasticsearchService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    super(Diary, dataSource.createEntityManager());
  }

  findById(id: number) {
    return this.findOne({
      where: {
        id,
      },
      relations: ['author'],
    });
  }

  async findDiaryDetailById(id: number): Promise<GetDiaryResponseDto> {
    const diaryInfo = await this.createQueryBuilder('diary')
      .select([
        'diary.id as diaryId',
        'diary.title as title',
        'diary.content as content',
        'diary.summary as summary',
        'diary.thumbnail as thumbnail',
        'diary.emotion as emotion',
        'diary.mood as mood',
        'diary.status as status',
        'diary.createdAt as createdAt',

        'user.id as userId',
        'user.nickname as authorName',
        'user.profileImage as profileImage',

        'GROUP_CONCAT(tags.name) as tagNames',
        'COUNT(reactions.reaction) as reactionCount',
      ])
      .where('diary.id = :id', { id })
      .leftJoin('diary.tags', 'tags')
      .leftJoin('diary.reactions', 'reactions')
      .leftJoin('diary.author', 'user')
      .groupBy('diary.id')
      .getRawOne();

    diaryInfo.tagNames = diaryInfo.tagNames ? diaryInfo.tagNames.split(',') : [];
    diaryInfo.reactionCount = Number(diaryInfo.reactionCount);

    return diaryInfo;
  }

  async findDiariesByAuthorIdWithPagination(
    authorId: number,
    userId: number,
    lastIndex: number | undefined,
  ): Promise<AllDiaryInfosDto[]> {
    const queryBuilder = this.createQueryBuilder('diary')
      .select([
        'diary.id as diaryId',
        'diary.title as title',
        'diary.summary as summary',
        'diary.thumbnail as thumbnail',
        'diary.createdAt as createdAt',
        'diary.emotion as emotion',

        'GROUP_CONCAT(tags.name) as tags',
        'COUNT(reactions.reaction) as reactionCount',
        'GROUP_CONCAT(CONCAT(reactions.userId, ":", reactions.reaction)) as leavedReaction',
      ])
      .where('diary.author.id = :authorId', { authorId })
      .leftJoin('diary.tags', 'tags')
      .leftJoin('diary.reactions', 'reactions')
      .groupBy('diary.id')
      .orderBy('diary.id', 'DESC')
      .limit(PAGINATION_SIZE);

    if (lastIndex) {
      queryBuilder.andWhere('diary.id < :lastIndex', { lastIndex });
    }
    if (authorId !== userId) {
      queryBuilder.andWhere('diary.status = :status', { status: 'public' });
    }

    const diaryInfos = await queryBuilder.getRawMany();
    diaryInfos.forEach((diaryInfo) => {
      diaryInfo.tags = diaryInfo.tags ? diaryInfo.tags.split(',') : [];
      diaryInfo.reactionCount = Number(diaryInfo.reactionCount);
      this.mapToLeaveReaction(diaryInfo, userId);
    });

    return diaryInfos;
  }

  async findDiariesByAuthorIdWithDates(
    authorId: number,
    userId: number,
    startDate: string,
    lastDate: Date,
  ) {
    const queryBuilder = this.createQueryBuilder('diary')
      .select([
        'diary.id as diaryId',
        'diary.title as title',
        'diary.summary as summary',
        'diary.thumbnail as thumbnail',
        'diary.createdAt as createdAt',
        'diary.emotion as emotion',

        'GROUP_CONCAT(tags.name) as tags',
        'COUNT(reactions.reaction) as reactionCount',
        'GROUP_CONCAT(CONCAT(reactions.userId, ":", reactions.reaction)) as leavedReaction',
      ])
      .where('diary.author.id = :authorId', { authorId })
      .andWhere('diary.createdAt BETWEEN :startDate AND :lastDate', { startDate, lastDate })
      .leftJoin('diary.tags', 'tags')
      .leftJoin('diary.reactions', 'reactions')
      .groupBy('diary.id')
      .orderBy('diary.id', 'DESC')
      .limit(PAGINATION_SIZE);

    if (authorId !== userId) {
      queryBuilder.andWhere('diary.status = :status', { status: 'public' });
    }

    const diaryInfos = await queryBuilder.getRawMany();
    diaryInfos.forEach((diaryInfo) => {
      diaryInfo.tags = diaryInfo.tags ? diaryInfo.tags.split(',') : [];
      diaryInfo.reactionCount = Number(diaryInfo.reactionCount);
      this.mapToLeaveReaction(diaryInfo, userId);
    });

    return diaryInfos;
  }

  findAllDiaryBetweenDates(
    userId: number,
    isOwner: boolean,
    startDate: string,
    lastDate: string,
  ): Promise<GetAllEmotionsResponseDto[]> {
    const queryBuilder = this.createQueryBuilder('diary')
      .select([
        'emotion',
        'JSON_ARRAYAGG(JSON_OBJECT("id", diary.id, "createdAt", diary.createdAt, "title", diary.title)) AS diaryInfo',
      ])
      .where('diary.author.id = :userId', { userId })
      .andWhere('diary.createdAt BETWEEN :startDate AND :lastDate', {
        startDate: startOfDay(new Date(startDate)),
        lastDate: endOfDay(new Date(lastDate)),
      })
      .groupBy('emotion');

    if (!isOwner) {
      queryBuilder.andWhere('diary.status = :status', { status: 'public' });
    }

    return queryBuilder.getRawMany();
  }

  async findPaginatedDiaryByDateAndIdList(
    userId: number,
    date: Date,
    idList: number[],
    lastIndex: number | undefined,
  ) {
    const queryBuilder = this.createQueryBuilder('diary')
      .select([
        'diary.id as diaryId',
        'diary.title as title',
        'diary.summary as summary',
        'diary.thumbnail as thumbnail',
        'diary.createdAt as createdAt',

        'user.id as authorId',
        'user.nickname as nickname',
        'user.profileImage as profileImage',

        'GROUP_CONCAT(tags.name) as tags',
        'COUNT(reactions.reaction) as reactionCount',
        'GROUP_CONCAT(CONCAT(reactions.userId, ":", reactions.reaction)) as leavedReaction',
      ])
      .where('diary.author IN (:...idList)', { idList })
      .andWhere('diary.createdAt > :date', { date })
      .andWhere('diary.status = :status', { status: DiaryStatus.PUBLIC })
      .leftJoin('diary.tags', 'tags')
      .leftJoin('diary.reactions', 'reactions')
      .leftJoin('diary.author', 'user')
      .groupBy('diary.id')
      .orderBy('diary.id', 'DESC')
      .limit(PAGINATION_SIZE);

    if (lastIndex) {
      queryBuilder.andWhere('diary.id < :lastIndex', { lastIndex });
    }

    const diaryInfos = await queryBuilder.getRawMany();

    diaryInfos.forEach((diaryInfo) => {
      diaryInfo.tags = diaryInfo.tags ? diaryInfo.tags.split(',') : [];
      diaryInfo.reactionCount = Number(diaryInfo.reactionCount);
      this.mapToLeaveReaction(diaryInfo, userId);
    });
    return diaryInfos;
  }

  async findLatestDiaryByDate(
    userId: number,
    startDate: Date,
    lastDate: Date,
  ): Promise<GetYearMoodResponseDto[]> {
    const diaries = await this.createQueryBuilder('diary')
      .select(['diary.createdAt as date', 'diary.mood as mood'])
      .where('diary.author.id = :userId', { userId })
      .andWhere('diary.createdAt BETWEEN :startDate AND :lastDate', { startDate, lastDate })
      .getRawMany();

    return diaries.map((diary) => ({
      date: new Date(diary.date),
      mood: diary.mood as MoodDegree,
    }));
  }

  async findDiaryByKeywordV1(
    userId: number,
    keyword: string,
    lastIndex: number,
  ): Promise<AllDiaryInfosDto[]> {
    const queryBuilder = this.createQueryBuilder('diary')
      .select([
        'diary.id as diaryId',
        'diary.title as title',
        'diary.summary as summary',
        'diary.thumbnail as thumbnail',
        'diary.createdAt as createdAt',
        'diary.emotion as emotion',

        'GROUP_CONCAT(tags.name) as tags',
        'COUNT(reactions.reaction) as reactionCount',
        'GROUP_CONCAT(CONCAT(reactions.userId, ":", reactions.reaction)) as leavedReaction',
      ])
      .where('diary.author.id = :userId', { userId })
      .andWhere('diary.content LIKE :keyword OR diary.title LIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .leftJoin('diary.tags', 'tags')
      .leftJoin('diary.reactions', 'reactions')
      .groupBy('diary.id')
      .orderBy('diary.id', 'DESC')
      .limit(PAGINATION_SIZE);

    if (lastIndex) {
      queryBuilder.andWhere('diary.id < :lastIndex', { lastIndex });
    }

    const diaryInfos = await queryBuilder.getRawMany();

    diaryInfos.forEach((diaryInfo) => {
      diaryInfo.tags = diaryInfo.tags ? diaryInfo.tags.split(',') : [];
      diaryInfo.reactionCount = Number(diaryInfo.reactionCount);
      this.mapToLeaveReaction(diaryInfo, userId);
    });
    return diaryInfos;
  }

  async findDiaryByKeywordV2(
    userId: number,
    keyword: string,
    lastIndex: number,
  ): Promise<AllDiaryInfosDto[]> {
    const queryBuilder = this.createQueryBuilder('diary')
      .select([
        'diary.id as diaryId',
        'diary.title as title',
        'diary.summary as summary',
        'diary.thumbnail as thumbnail',
        'diary.createdAt as createdAt',
        'diary.emotion as emotion',

        'GROUP_CONCAT(tags.name) as tags',
        'COUNT(reactions.reaction) as reactionCount',
        'GROUP_CONCAT(CONCAT(reactions.userId, ":", reactions.reaction)) as leavedReaction',
      ])
      .where('diary.author.id = :userId', { userId })
      .andWhere(
        '(MATCH(diary.content) AGAINST(:keyword IN BOOLEAN MODE) OR MATCH(diary.title) AGAINST(:keyword IN BOOLEAN MODE))',
        { keyword: `*${keyword}*` },
      )
      .leftJoin('diary.tags', 'tags')
      .leftJoin('diary.reactions', 'reactions')
      .groupBy('diary.id')
      .orderBy('diary.id', 'DESC')
      .limit(PAGINATION_SIZE);

    if (lastIndex) {
      queryBuilder.andWhere('diary.id < :lastIndex', { lastIndex });
    }

    const diaryInfos = await queryBuilder.getRawMany();

    diaryInfos.forEach((diaryInfo) => {
      diaryInfo.tags = diaryInfo.tags ? diaryInfo.tags.split(',') : [];
      diaryInfo.reactionCount = Number(diaryInfo.reactionCount);
      this.mapToLeaveReaction(diaryInfo, userId);
    });
    return diaryInfos;
  }

  async findDiaryByKeywordV3(
    userId: number,
    keyword: string,
    lastIndex: number,
  ): Promise<SearchDiaryDataForm[]> {
    const documents = await this.elasticsearchService.search({
      index: process.env.ELASTICSEARCH_INDEX,
      body: {
        _source: [
          'authorname',
          'diaryid',
          'thumbnail',
          'title',
          'summary',
          'tagnames',
          'emotion',
          'reactions',
          'reactionUsers',
          'authorid',
          'createdat',
        ],
        search_after: lastIndex ? [lastIndex] : undefined,
        size: PAGINATION_SIZE,
        query: {
          bool: {
            must: [
              { term: { authorid: userId } },
              {
                multi_match: {
                  query: keyword,
                  fields: ['content.nori', 'content.ngram', 'title.ngram', 'title.nori'],
                },
              },
            ],
          },
        },
        sort: [{ diaryid: 'desc' }],
      },
    });

    return documents.hits.hits.map((hit) => hit._source as SearchDiaryDataForm);
  }

  async findDiaryByTag(
    userId: number,
    tagName: string,
    lastIndex: number | undefined,
  ): Promise<AllDiaryInfosDto[]> {
    const queryBuilder = this.createQueryBuilder('diary')
      .select([
        'diary.id as diaryId',
        'diary.title as title',
        'diary.summary as summary',
        'diary.thumbnail as thumbnail',
        'diary.createdAt as createdAt',
        'diary.emotion as emotion',

        'GROUP_CONCAT(tags.name) as tags',
        'COUNT(reactions.reaction) as reactionCount',
        'GROUP_CONCAT(CONCAT(reactions.userId, ":", reactions.reaction)) as leavedReaction',
      ])
      .where('diary.author.id = :userId', { userId })
      .andWhere('tags.name = :tagName', { tagName })
      .leftJoin('diary.tags', 'tags')
      .leftJoin('diary.reactions', 'reactions')
      .groupBy('diary.id')
      .orderBy('diary.id', 'DESC')
      .limit(PAGINATION_SIZE);

    if (lastIndex) {
      queryBuilder.andWhere('diary.id < :lastIndex', { lastIndex });
    }

    const diaries = await queryBuilder.getRawMany();

    diaries.forEach((diaryInfo) => {
      diaryInfo.tags = diaryInfo.tags ? diaryInfo.tags.split(',') : [];
      diaryInfo.reactionCount = Number(diaryInfo.reactionCount);
      this.mapToLeaveReaction(diaryInfo, userId);
    });

    return diaries;
  }

  async addDiaryEvent(diaryId: number): Promise<void> {
    this.redis.publish('diary.event', JSON.stringify({ diaryId }));
  }

  private mapToLeaveReaction(diaryInfo, userId: number) {
    let leavedReaction = false;
    if (diaryInfo.leavedReaction) {
      diaryInfo.leavedReaction.split(',').forEach((reaction) => {
        const match = reaction.match(/\d+:/);

        if (match && Number(match[0].substring(0, match[0].length - 1)) === userId) {
          diaryInfo.leavedReaction = reaction.replace(match[0], '');
          leavedReaction = true;
        }
      });
    }

    if (!leavedReaction) {
      diaryInfo.leavedReaction = null;
    }
  }
}
