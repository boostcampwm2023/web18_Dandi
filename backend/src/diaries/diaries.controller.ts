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
  CreateDiaryDto,
  GetAllEmotionsRequestDto,
  GetAllEmotionsResponseDto,
  GetDiaryResponseDto,
  ReadUserDiariesRequestDto,
  ReadUserDiariesResponseDto,
  UpdateDiaryDto,
  GetYearMoodResponseDto,
  FeedDiaryDto,
} from './dto/diary.dto';
import { DiariesService } from './diaries.service';
import { User as UserEntity } from 'src/users/entity/user.entity';
import { User } from 'src/users/utils/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';

@ApiTags('Diary API')
@Controller('diaries')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

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

  @Get('/friends')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '피드 일기 조회 API' })
  @ApiOkResponse({ description: '피드 일기 조회 성공', type: FeedDiaryDto })
  async getFeedDiary(
    @User() user: UserEntity,
    @Query('lastIndex', new ParseIntPipe({ optional: true })) lastIndex: number,
  ): Promise<Record<string, FeedDiaryDto[]>> {
    const diaryList = await this.diariesService.getFeedDiary(user.id, lastIndex);

    return { diaryList };
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '일기 조회 API' })
  @ApiOkResponse({ description: '일기 조회 성공', type: GetDiaryResponseDto })
  async findDiary(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ): Promise<GetDiaryResponseDto> {
    return await this.diariesService.findDiaryDetail(user, id);
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
    const responseDto = await this.diariesService.findDiaryByAuthorId(user, id, requestDto);

    return responseDto;
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
    type: [GetYearMoodResponseDto],
  })
  async getMoodForYear(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Record<string, GetYearMoodResponseDto[]>> {
    const yearMood = await this.diariesService.getMoodForYear(userId);

    return { yearMood };
  }

  @Get('/search/v1/:keyword')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '키워드로 일기 검색(MySQL Like)' })
  @ApiCreatedResponse({
    description: '일기 검색 성공',
    type: ReadUserDiariesResponseDto,
  })
  async findDiaryByKeywordV1(
    @User() author: UserEntity,
    @Param('keyword') keyword: string,
    @Query('lastIndex', new ParseIntPipe({ optional: true })) lastIndex: number,
  ): Promise<ReadUserDiariesResponseDto> {
    return await this.diariesService.findDiaryByKeywordV1(author, keyword, lastIndex);
  }

  @Get('/search/v2/:keyword')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '키워드로 일기 검색(MySQL Full Text Index)' })
  @ApiCreatedResponse({
    description: '일기 검색 성공',
    type: ReadUserDiariesResponseDto,
  })
  async findDiaryByKeywordV2(
    @User() author: UserEntity,
    @Param('keyword') keyword: string,
    @Query('lastIndex', new ParseIntPipe({ optional: true })) lastIndex: number,
  ): Promise<ReadUserDiariesResponseDto> {
    return await this.diariesService.findDiaryByKeywordV2(author, keyword, lastIndex);
  }

  @Get('/search/v3/:keyword')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '키워드로 일기 검색(Elasticsearch)' })
  @ApiOkResponse({
    description: '일기 검색 성공',
    type: ReadUserDiariesResponseDto,
  })
  async findDiaryByKeywordV3(
    @User() author: UserEntity,
    @Param('keyword') keyword: string,
    @Query('lastIndex', new ParseIntPipe({ optional: true })) lastIndex: number,
  ): Promise<ReadUserDiariesResponseDto> {
    const diaryList = await this.diariesService.findDiaryByKeywordV3(author, keyword, lastIndex);

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
    @Query('lastIndex', new ParseIntPipe({ optional: true })) lastIndex: number,
  ): Promise<ReadUserDiariesResponseDto> {
    return await this.diariesService.findDiaryByTag(user, tagName, lastIndex);
  }
}
