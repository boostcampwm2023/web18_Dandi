import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { User as UserEntity } from 'src/users/entity/user.entity';
import { RecommendedTagsResponseDto } from './dto/tag.dto';
import { User } from 'src/users/utils/user.decorator';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('search/:keyword')
  @UseGuards(JwtAuthGuard)
  async recommendKeywords(
    @User() user: UserEntity,
    @Param('keyword') keyword: string,
  ): Promise<RecommendedTagsResponseDto> {
    const keywords = await this.tagsService.recommendKeywords(user.id, keyword);

    return { keywords };
  }
}
