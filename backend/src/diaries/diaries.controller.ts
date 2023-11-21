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
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateDiaryDto,
  DiaryPeedResponseDto,
  GetDiaryResponseDto,
  ReadUserDiariesDto,
  ReadUserDiariesResponseDto,
  UpdateDiaryDto,
} from './dto/diary.dto';
import { DiariesService } from './diaries.service';
import { User as UserEntity } from 'src/users/entity/user.entity';
import { User } from 'src/users/utils/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';

@ApiTags('Diary API')
@Controller('diaries')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '일기 조회 API' })
  @ApiOkResponse({ description: '일기 조회 성공', type: GetDiaryResponseDto })
  async findDiary(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ): Promise<GetDiaryResponseDto> {
    const diary = await this.diariesService.findDiary(user, id, true);
    const tags = await diary.tags;
    const reactions = await diary.reactions;

    return {
      userId: diary.author.id,
      authorName: diary.author.nickname,
      title: diary.title,
      content: diary.content,
      thumbnail: diary.thumbnail,
      emotion: diary.emotion,
      mood: diary.mood,
      tags: tags.map((t) => t.name),
      reactionCount: reactions.length,
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
  async readUsersDiary(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Query(ValidationPipe) readUserDiariesDto: ReadUserDiariesDto,
  ): Promise<ReadUserDiariesResponseDto> {
    const diaries = await this.diariesService.findDiaryByAuthorId(user, id, readUserDiariesDto);

    //TODO:N+1 문제 발생 중..., summary 필드 추가 필요
    const diaryList: DiaryPeedResponseDto[] = await Promise.all(
      diaries.map(async (diary) => {
        const tags = await diary.tags;
        const reactions = await diary.reactions;

        return {
          diaryId: diary.id,
          createdAt: diary.createdAt,
          thumbnail: diary.thumbnail,
          title: diary.title,
          tags: tags.map((t) => t.name),
          emotion: diary.emotion,
          reactionCount: reactions ? reactions.length : 0,
        };
      }),
    );

    return {
      nickname: 'hi',
      diaryList,
    };
  }
}
