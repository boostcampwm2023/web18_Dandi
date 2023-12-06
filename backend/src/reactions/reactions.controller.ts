import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User as UserEntity } from 'src/users/entity/user.entity';
import { User } from 'src/users/utils/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { ReactionRequestDto, ReactionInfoResponseDto } from './dto/reaction.dto';
import { ReactionsService } from './reactions.service';

@ApiTags('Reaction API')
@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get('/:diaryId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '리액션 조회 API' })
  @ApiOkResponse({ description: '리액션 조회 성공' })
  async getReactions(
    @Param('diaryId', ParseIntPipe) diaryId: number,
  ): Promise<Record<string, ReactionInfoResponseDto[]>> {
    const reactionList = await this.reactionsService.getAllReaction(diaryId);

    return { reactionList };
  }

  @Post('/:diaryId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiOperation({ description: '리액션 저장 API' })
  @ApiCreatedResponse({ description: '리액션 저장 성공' })
  async createReaction(
    @User() user: UserEntity,
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @Body() createReactionDto: ReactionRequestDto,
  ) {
    await this.reactionsService.saveReaction(user, diaryId, createReactionDto);

    return '일기에 반응을 남겼습니다.';
  }

  @Put('/:diaryId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '리액션 변경 API' })
  @ApiOkResponse({ description: '리액션 변경 성공' })
  async updateReaction(
    @User() user: UserEntity,
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @Body() reactionRequestDto: ReactionRequestDto,
  ) {
    await this.reactionsService.updateReaction(user, diaryId, reactionRequestDto);

    return '일기에 반응을 수정했습니다.';
  }

  @Delete('/:diaryId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '리액션 삭제 API' })
  @ApiOkResponse({ description: '리액션 삭제 성공' })
  async deleteReaction(
    @User() user: UserEntity,
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @Body() reactionRequestDto: ReactionRequestDto,
  ) {
    await this.reactionsService.deleteReaction(user, diaryId, reactionRequestDto);

    return '일기에 반응을 삭제했습니다.';
  }
}
