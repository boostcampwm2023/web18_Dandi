import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDiaryDto, UpdateDiaryDto } from './dto/diary.dto';
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

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async updateDiary(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiaryDto: UpdateDiaryDto,
  ) {
    await this.diariesService.updateDiary(id, user, updateDiaryDto);

    return '일기가 저장되었습니다.';
  }
}
