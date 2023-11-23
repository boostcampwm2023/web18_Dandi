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
  UpdateDiaryDto,
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
  async getMoodForYear(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Record<string, getYearMoodResponseDto[]>> {
    const yearMood = await this.diariesService.getMoodForYear(userId);

    return { yearMood };
  }
}
