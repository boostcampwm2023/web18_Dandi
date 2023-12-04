import { DataSource, Repository } from 'typeorm';
import { Diary } from './entity/diary.entity';
import { Injectable } from '@nestjs/common';
import { DiaryStatus } from './entity/diaryStatus';
import { PAGINATION_SIZE, ITEM_PER_PAGE } from './utils/diaries.constant';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { GetDiaryResponseDto, SearchDiaryDataForm } from './dto/diary.dto';

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
  ) {
    const queryBuilder = this.createQueryBuilder('diary')
      .leftJoin('diary.tags', 'tags')
      .leftJoinAndSelect('diary.reactions', 'reactions')
      .leftJoinAndSelect('reactions.user', 'user')
      .where('diary.author.id = :authorId', {
        authorId,
      })
      .orderBy('diary.id', 'DESC')
      .limit(ITEM_PER_PAGE);

    if (lastIndex) {
      queryBuilder.andWhere('diary.id < :lastIndex', { lastIndex });
    }
    if (!isOwner) {
      queryBuilder.andWhere('diary.status = :status', { status: 'public' });
    }
    return await queryBuilder.getMany();
  }

  findDiariesByAuthorIdWithDates(
    authorId: number,
    isOwner: boolean,
    startDate: string,
    lastDate: Date,
  ) {
    const queryBuilder = this.createQueryBuilder('diary')
      .leftJoin('diary.tags', 'tags')
      .leftJoinAndSelect('diary.reactions', 'reactions')
      .leftJoinAndSelect('reactions.user', 'user')
      .where('diary.author.id = :authorId', { authorId })
      .andWhere('diary.createdAt BETWEEN :startDate AND :lastDate', { startDate, lastDate })
      .orderBy('diary.id', 'DESC');

    if (!isOwner) {
      queryBuilder.andWhere('diary.status = :status', { status: 'public' });
    }

    return queryBuilder.getMany();
  }

  findAllDiaryBetweenDates(
    userId: number,
    isOwner: boolean,
    startDate: string,
    lastDate: string,
  ): Promise<Diary[]> {
    const queryBuilder = this.createQueryBuilder('diary')
      .leftJoin('diary.tags', 'tags')
      .leftJoin('diary.reactions', 'reactions')
      .where('diary.author.id = :userId', { userId })
      .andWhere('diary.createdAt BETWEEN :startDate AND :lastDate', { startDate, lastDate });

    if (!isOwner) {
      queryBuilder.andWhere('diary.status = :status', { status: 'public' });
    }

    return queryBuilder.getMany();
  }

  async findPaginatedDiaryByDateAndIdList(
    date: Date,
    idList: number[],
    lastIndex: number | undefined,
  ) {
    const queryBuilder = this.createQueryBuilder('diary')
      .leftJoinAndSelect('diary.author', 'user')
      .leftJoinAndSelect('diary.tags', 'tags')
      .leftJoinAndSelect('diary.reactions', 'reactions')
      .leftJoinAndSelect('reactions.user', 'reactionUser')
      .where('diary.author IN (:...idList)', { idList })
      .andWhere('diary.createdAt > :date', { date })
      .andWhere('diary.status = :status', { status: DiaryStatus.PUBLIC })
      .orderBy('diary.id', 'DESC')
      .limit(PAGINATION_SIZE);

    if (lastIndex) {
      queryBuilder.andWhere('diary.id < :lastIndex', { lastIndex });
    }

    return await queryBuilder.getMany();
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
}
