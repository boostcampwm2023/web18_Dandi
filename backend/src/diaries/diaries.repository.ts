import { DataSource, Repository } from 'typeorm';
import { Diary } from './entity/diary.entity';
import { Injectable } from '@nestjs/common';
import { DiaryStatus } from './entity/diaryStatus';
import { PAGINATION_SIZE } from './utils/diaries.constant';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  AllDiaryInfosDto,
  GetAllEmotionsResponseDto,
  GetDiaryResponseDto,
  SearchDiaryDataForm,
} from './dto/diary.dto';

@Injectable()
export class DiariesRepository extends Repository<Diary> {
  constructor(
    private dataSource: DataSource,
    private readonly elasticsearchService: ElasticsearchService,
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
    isOwner: boolean,
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
    if (!isOwner) {
      queryBuilder.andWhere('diary.status = :status', { status: 'public' });
    }

    const diaryInfos = await queryBuilder.getRawMany();
    diaryInfos.forEach((diaryInfo) => {
      diaryInfo.tags = diaryInfo.tags ? diaryInfo.tags.split(',') : [];
      diaryInfo.reactionCount = Number(diaryInfo.reactionCount);
      this.mapToLeaveReaction(diaryInfo);
    });

    return diaryInfos;
  }

  async findDiariesByAuthorIdWithDates(
    authorId: number,
    isOwner: boolean,
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

    if (!isOwner) {
      queryBuilder.andWhere('diary.status = :status', { status: 'public' });
    }

    const diaryInfos = await queryBuilder.getRawMany();
    diaryInfos.forEach((diaryInfo) => {
      diaryInfo.tags = diaryInfo.tags ? diaryInfo.tags.split(',') : [];
      diaryInfo.reactionCount = Number(diaryInfo.reactionCount);
      this.mapToLeaveReaction(diaryInfo);
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
        startDate: new Date(startDate),
        lastDate: new Date(lastDate),
      })
      .groupBy('emotion');

    if (!isOwner) {
      queryBuilder.andWhere('diary.status = :status', { status: 'public' });
    }

    return queryBuilder.getRawMany();
  }

  async findPaginatedDiaryByDateAndIdList(
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
      this.mapToLeaveReaction(diaryInfo);
    });
    return diaryInfos;
  }

  findLatestDiaryByDate(userId: number, date: Date) {
    return this.createQueryBuilder('diary')
      .where('diary.author = :userId', { userId })
      .andWhere('diary.createdAt > :date', { date })
      .getMany();
  }

  findDiaryByKeywordV1(authorId: number, keyword: string, lastIndex: number) {
    const queryBuilder = this.createQueryBuilder('diary')
      .leftJoin('diary.tags', 'tags')
      .leftJoinAndSelect('diary.reactions', 'reactions')
      .leftJoinAndSelect('reactions.user', 'reactionUser')
      .where('diary.author.id = :authorId', { authorId })
      .andWhere('diary.content LIKE :keyword OR diary.title LIKE :keyword', {
        keyword: `%${keyword}%`,
      })
      .limit(PAGINATION_SIZE);

    if (lastIndex) {
      queryBuilder.andWhere('diary.id < :lastIndex', { lastIndex });
    }

    return queryBuilder.getMany();
  }

  async findDiaryByKeywordV2(authorId: number, keyword: string, lastIndex: number) {
    const queryBuilder = this.createQueryBuilder('diary')
      .leftJoin('diary.tags', 'tags')
      .leftJoinAndSelect('diary.reactions', 'reactions')
      .leftJoinAndSelect('reactions.user', 'reactionUser')
      .where('diary.author.id = :authorId', { authorId })
      .andWhere(
        '(MATCH(diary.content) AGAINST(:keyword IN BOOLEAN MODE) OR MATCH(diary.title) AGAINST(:keyword IN BOOLEAN MODE))',
        { keyword: `*${keyword}*` },
      )
      .limit(PAGINATION_SIZE);

    if (lastIndex) {
      queryBuilder.andWhere('diary.id < :lastIndex', { lastIndex });
    }

    return queryBuilder.getMany();
  }

  async findDiaryByKeywordV3(
    id: number,
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
              { term: { authorid: id } },
              {
                bool: {
                  should: [{ match: { content: keyword } }, { match: { title: keyword } }],
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

  findDiaryByTag(userId: number, tagName: string, lastIndex: number | undefined) {
    const queryBuilder = this.createQueryBuilder('diary')
      .leftJoinAndSelect('diary.reactions', 'reactions')
      .leftJoinAndSelect('reactions.user', 'reactionUser')
      .innerJoin('diary.tags', 'tags')
      .where('tags.name = :tagName', { tagName })
      .andWhere('diary.author.id = :userId', { userId })
      .orderBy('diary.id', 'DESC')
      .limit(PAGINATION_SIZE);

    if (lastIndex) {
      queryBuilder.andWhere('diary.id < :lastIndex', { lastIndex });
    }

    return queryBuilder.getMany();
  }

  private mapToLeaveReaction(diaryInfo: any) {
    if (diaryInfo.leavedReaction) {
      diaryInfo.leavedReaction.split(',').forEach((reaction) => {
        const match = reaction.match(/\d+:/);

        if (match) {
          diaryInfo.leavedReaction = reaction.replace(match[0], '');
          return;
        }
      });
    }
  }
}
