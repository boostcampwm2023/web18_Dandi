import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { User } from 'src/users/utils/user.decorator';
import { User as UserEntity } from 'src/users/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchUserResponseDto } from 'src/users/dto/user.dto';
import { StrangerResponseDto } from './dto/friend.dto';

@ApiTags('friends API')
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get('/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '특정 사용자의 친구 목록 조회' })
  @ApiOkResponse({ description: '친구 목록 조회 성공' })
  async getFriendsManageList(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Record<string, SearchUserResponseDto[] | StrangerResponseDto[]>> {
    const friends = await this.friendsService.getFriendsList(userId);
    const strangers = await this.friendsService.getStrangerList(userId);

    return { friends, strangers };
  }

  @Post('/:receiverId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '친구 신청 API' })
  @ApiCreatedResponse({ description: '친구 신청 성공' })
  async requestFriend(
    @User() user: UserEntity,
    @Param('receiverId', ParseIntPipe) receiverId: number,
  ): Promise<string> {
    await this.friendsService.requestFriend({ senderId: user.id, receiverId });

    return '친구 신청이 완료되었습니다.';
  }

  @Delete('/:receiverId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '내가 보낸 친구 신청 취소 API' })
  @ApiOkResponse({ description: '친구 신청 취소 성공' })
  async cancelFriendRequest(
    @User() user: UserEntity,
    @Param('receiverId', ParseIntPipe) receiverId: number,
  ): Promise<string> {
    await this.friendsService.cancelFriendRequest({ senderId: user.id, receiverId });

    return '친구 신청이 취소되었습니다.';
  }

  @Get('search/:nickname')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '나의 친구 목록에서 친구 검색' })
  @ApiOkResponse({ description: '친구 검색 성공' })
  async searchFriend(
    @User() user: UserEntity,
    @Param('nickname') nickname: string,
  ): Promise<SearchUserResponseDto[]> {
    return this.friendsService.searchFriend(user.id, nickname);
  }
}
