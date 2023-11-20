import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDiaryDto } from './dto/diary.dto';
import { DiariesService } from './diaries.service';
import { AuthGuard } from '@nestjs/passport';
import { JWT } from 'src/auth/utils/jwt.type';
import { User as UserEntity } from 'src/users/entity/user.entity';
import { User } from 'src/users/utils/user.decorator';

@ApiTags('Diary API')
@Controller('diaries')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Post()
  @UseGuards(AuthGuard(JWT))
  @UsePipes(ValidationPipe)
  @ApiOperation({ description: '일기 저장 API' })
  @ApiOkResponse({ description: '일기 저장 성공' })
  @ApiBody({ type: CreateDiaryDto })
  async createDiary(@User() user: UserEntity, @Body() createDiaryDto: CreateDiaryDto) {
    await this.diariesService.saveDiary(user, createDiaryDto);

    return '일기가 저장되었습니다.';
  }
}
