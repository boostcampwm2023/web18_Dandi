import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  AllDiaryInfosDto,
  CreateDiaryDto,
  GetAllEmotionsRequestDto,
  GetAllEmotionsResponseDto,
  GetDiaryResponseDto,
  ReadUserDiariesRequestDto,
  ReadUserDiariesResponseDto,
  UpdateDiaryDto,
  getFeedDiaryRequestDto,
  getFeedDiaryResponseDto,
  getYearMoodResponseDto,
} from './dto/diary.dto';
import { DiariesService } from './diaries.service';
import { User as UserEntity } from 'src/users/entity/user.entity';
import { User } from 'src/users/utils/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';

@ApiTags('Diary API')
@Controller('diaries')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Get('/friends')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '피드 일기 조회 API' })
  @ApiOkResponse({ description: '피드 일기 조회 성공', type: getFeedDiaryResponseDto })
  async getFeedDiary(
    @User() user: UserEntity,
    @Query(ValidationPipe) queryString: getFeedDiaryRequestDto,
  ): Promise<getFeedDiaryResponseDto> {
    const [diaryList, lastIndex] = await this.diariesService.getFeedDiary(
      user.id,
      queryString.lastIndex,
    );

    return { lastIndex, diaryList };
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '일기 조회 API' })
  @ApiOkResponse({ description: '일기 조회 성공', type: GetDiaryResponseDto })
  async findDiary(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ): Promise<GetDiaryResponseDto> {
    const diary = await this.diariesService.findDiary(user, id);
    const tags = await diary.tags;
    const author = await diary.author;
    const reactions = await diary.reactions;

    return {
      userId: author.id,
      authorName: author.nickname,
      profileImage: author.profileImage,
      title: diary.title,
      content: diary.content,
      thumbnail: diary.thumbnail,
      emotion: diary.emotion,
      mood: diary.mood,
      tags: tags.map((t) => t.name),
      reactionCount: reactions.length,
      createdAt: diary.createdAt,
      status: diary.status,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiOperation({ description: '일기 저장 API' })
  @ApiCreatedResponse({ description: '일기 저장 성공' })
  @ApiBody({ type: CreateDiaryDto })
  async createDiary(@User() user: UserEntity, @Body() createDiaryDto: CreateDiaryDto) {
    await this.diariesService.saveDiary(user, createDiaryDto);

    return '일기가 저장되었습니다.';
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiOperation({ description: '일기 수정 API' })
  @ApiOkResponse({ description: '일기 수정 성공' })
  @ApiBody({ type: UpdateDiaryDto })
  async updateDiary(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiaryDto: UpdateDiaryDto,
  ) {
    await this.diariesService.updateDiary(id, user, updateDiaryDto);

    return '일기가 수정되었습니다.';
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '일기 삭제 API' })
  @ApiCreatedResponse({ description: '일기 삭제 성공' })
  async deleteDiary(@User() user: UserEntity, @Param('id', ParseIntPipe) id: number) {
    await this.diariesService.deleteDiary(user, id);

    return '일기가 삭제되었습니다.';
  }

  @Get('/users/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '기간 내 일기 리스트 조회 API' })
  @ApiCreatedResponse({
    description: '일기 리스트 조회 성공',
    type: [ReadUserDiariesResponseDto],
  })
  @ApiQuery({ type: GetAllEmotionsRequestDto })
  async readUsersDiary(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Query(ValidationPipe) requestDto: ReadUserDiariesRequestDto,
  ): Promise<ReadUserDiariesResponseDto> {
    const { author, diaries } = await this.diariesService.findDiaryByAuthorId(user, id, requestDto);

    const diaryInfos = diaries.map<Promise<AllDiaryInfosDto>>(async (diary) => {
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
        leavedReaction: reactions.find((reaction) => reaction.user.id === id)?.reaction,
      };
    });

    return { nickname: author.nickname, diaryList: await Promise.all(diaryInfos) };
  }

  @Get('/emotions/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '기간 내 일기 emotion 조회 API' })
  @ApiCreatedResponse({
    description: '일기 emotion 조회 성공',
    type: [GetAllEmotionsResponseDto],
  })
  @ApiQuery({ type: GetAllEmotionsRequestDto })
  async getAllDiaryEmotions(
    @User() user: UserEntity,
    @Param('userId', ParseIntPipe) userId: number,
    @Query(ValidationPipe) getAllDiaryEmotionsDto: GetAllEmotionsRequestDto,
  ): Promise<Record<string, GetAllEmotionsResponseDto[]>> {
    const emotions = await this.diariesService.findAllDiaryEmotions(
      user,
      userId,
      getAllDiaryEmotionsDto,
    );

    return { emotions };
  }

  @Get('/mood/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '1년의 일기 mood조회' })
  @ApiCreatedResponse({
    description: '일기 mood 조회 성공',
    type: [getYearMoodResponseDto],
  })
  async getMoodForYear(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Record<string, getYearMoodResponseDto[]>> {
    const yearMood = await this.diariesService.getMoodForYear(userId);

    return { yearMood };
  }

  @Get('/search/:keyword')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '키워드로 일기 검색' })
  @ApiOkResponse({
    description: '일기 검색 성공',
    type: ReadUserDiariesResponseDto,
  })
  async findDiaryByKeyword(
    @User() author: UserEntity,
    @Param('keyword') keyword: string,
  ): Promise<ReadUserDiariesResponseDto> {
    const diaryList = await this.diariesService.findDiaryByKeyword(author, keyword);

    return { nickname: author.nickname, diaryList };
  }

  @Get('/tags/:tagName')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '특정 태그가 포함된 일기 조회' })
  @ApiOkResponse({
    description: '특정 태그가 포함된 일기 조회 성공',
    type: ReadUserDiariesResponseDto,
  })
  async findDiaryByTag(
    @User() user: UserEntity,
    @Param('tagName') tagName: string,
  ): Promise<ReadUserDiariesResponseDto> {
    const diaryList = await this.diariesService.findDiaryByTag(user.id, tagName);

    return { nickname: user.nickname, diaryList };
  }
}
