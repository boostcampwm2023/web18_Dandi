import { DataSource, Repository } from 'typeorm';
import { Diary } from './entity/diary.entity';
import { Injectable } from '@nestjs/common';
import { DiaryStatus } from './entity/diaryStatus';
import { PAGINATION_SIZE, ITEM_PER_PAGE } from './utils/diaries.constant';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchDiaryDataForm } from './dto/diary.dto';

@Injectable()
export class DiariesRepository extends Repository<Diary> {
  constructor(
    private dataSource: DataSource,
    private readonly elasticsearchService: ElasticsearchService,
  ) {
    super(Diary, dataSource.createEntityManager());
  }

  async findById(id: number) {
    return this.findOne({
      where: {
        id,
      },
    });
  }

  async findDiariesByAuthorIdWithPagination(authorId: number, isOwner: boolean, lastIndex: number) {
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

  async findDiariesByAuthorIdWithDates(
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

  async findAllDiaryBetweenDates(
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

  async findPaginatedDiaryByDateAndIdList(date: Date, idList: number[], lastIndex: number) {
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

  async findLatestDiaryByDate(userId: number, date: Date) {
    return await this.createQueryBuilder('diary')
      .where('diary.author = :userId', { userId })
      .andWhere('diary.createdAt > :date', { date })
      .getMany();
  }

  async findDiaryByKeywordV1(authorId: number, keyword: string) {
    const queryBuilder = this.createQueryBuilder('diary')
      .leftJoin('diary.tags', 'tags')
      .leftJoinAndSelect('diary.reactions', 'reactions')
      .leftJoinAndSelect('reactions.user', 'reactionUser')
      .where('diary.author.id = :authorId', { authorId })
      .andWhere('diary.content LIKE :keyword OR diary.title LIKE :keyword', {
        keyword: `%${keyword}%`,
      });

    return queryBuilder.getMany();
  }

  async findDiaryByKeywordV2(id: number, keyword: string): Promise<SearchDiaryDataForm[]> {
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
      },
    });

    return documents.hits.hits.map((hit) => hit._source as SearchDiaryDataForm);
  }

  findDiaryByTag(userId: number, tagName: string, lastIndex: number) {
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
