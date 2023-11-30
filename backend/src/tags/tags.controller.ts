import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { User as UserEntity } from 'src/users/entity/user.entity';
import { RecommendedTagsResponseDto } from './dto/tag.dto';
import { User } from 'src/users/utils/user.decorator';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('search/:keyword')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '추천 키워드 조회 API' })
  @ApiOkResponse({ description: '추천 키워드 조회 성공', type: RecommendedTagsResponseDto })
  async recommendKeywords(
    @User() user: UserEntity,
    @Param('keyword') keyword: string,
  ): Promise<RecommendedTagsResponseDto> {
    const keywords = await this.tagsService.recommendKeywords(user.id, keyword);

    return { keywords };
  }
}
