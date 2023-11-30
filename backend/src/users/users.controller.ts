import { Body, Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  SearchUserResponseDto,
  GetUserResponseDto,
  UpdateUserProfileRequestDto,
} from './dto/user.dto';
import { User } from './utils/user.decorator';
import { User as UserEntity } from './entity/user.entity';

@ApiTags('Users API')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '사용자 정보 조회 API' })
  @ApiOkResponse({ description: '사용자 정보 조회 성공', type: GetUserResponseDto })
  async getUserInfo(@Param('userId', ParseIntPipe) userId: number): Promise<GetUserResponseDto> {
    const { user, totalFriends, isExistedTodayDiary } =
      await this.usersService.findUserInfo(userId);

    return {
      nickname: user.nickname,
      profileImage: user.profileImage,
      totalFriends,
      isExistedTodayDiary,
    };
  }

  @Patch('/profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '사용자 정보 수정 API' })
  @ApiOkResponse({ description: '사용자 정보 수정 성공', type: UpdateUserProfileRequestDto })
  async updateUserInfo(@User() user: UserEntity, @Body() requestDto: UpdateUserProfileRequestDto) {
    await this.usersService.updateUserProfile(user, requestDto);

    return '사용자 정보 수정에 성공했습니다.';
  }

  @Get('/search/:nickname')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '닉네임으로 사용자 검색 API' })
  @ApiOkResponse({ description: '닉네임을 사용자 검색 성공', type: Array<SearchUserResponseDto> })
  searchUsers(@Param('nickname') nickname: string): Promise<SearchUserResponseDto[]> {
    return this.usersService.searchUsers(nickname);
  }
}
