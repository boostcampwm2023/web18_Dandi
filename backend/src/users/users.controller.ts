import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchUserResponseDto, getUserResponseDto } from './dto/user.dto';

@ApiTags('Users API')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '사용자 정보 조회 API' })
  @ApiOkResponse({ description: '사용자 정보 조회 성공', type: getUserResponseDto })
  async getUserInfo(@Param('userId', ParseIntPipe) userId: number): Promise<getUserResponseDto> {
    const { user, totalFriends, isExistedTodayDiary } =
      await this.usersService.findUserInfo(userId);

    return {
      nickname: user.nickname,
      profileImage: user.profileImage,
      totalFriends,
      isExistedTodayDiary,
    };
  }

  @Get('/search/:nickname')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '닉네임으로 사용자 검색 API' })
  @ApiOkResponse({ description: '닉네임을 사용자 검색 성공', type: Array<SearchUserResponseDto> })
  searchUsers(@Param('nickname') nickname: string): Promise<SearchUserResponseDto[]> {
    return this.usersService.searchUsers(nickname);
  }
}
