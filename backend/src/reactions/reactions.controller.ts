import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User as UserEntity } from 'src/users/entity/user.entity';
import { User } from 'src/users/utils/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { CreateReactionDto } from './dto/reaction.dto';
import { ReactionsService } from './reactions.service';

@ApiTags('Reaction API')
@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post('/:diaryId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiOperation({ description: '일기 리액션 API' })
  @ApiCreatedResponse({ description: '리액션 저장 성공' })
  async createDiary(
    @User() user: UserEntity,
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @Body() createReactionDto: CreateReactionDto,
  ) {
    await this.reactionsService.saveReaction(user, diaryId, createReactionDto);

    return '일기에 반응을 남겼습니다.';
  }
}
