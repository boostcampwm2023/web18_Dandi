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
  async getFriendsList(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Record<string, SearchUserResponseDto[]>> {
    const friends = await this.friendsService.getFriendsList(userId);

    return { friends };
  }

  @Get('request/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '특정 사용자의 진행 중인 친구신청 목록 조회' })
  @ApiOkResponse({ description: '진행 중인 친구 신청 조회 성공' })
  async getFriendRequestList(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Record<string, StrangerResponseDto[]>> {
    const strangers = await this.friendsService.getStrangerList(userId);

    return { strangers };
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

  @Delete('/tmp/:friendId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '내가 보낸 친구 신청 취소 API' })
  @ApiOkResponse({ description: '친구 신청 취소 성공' })
  async deleteFriendRelation(
    @User() user: UserEntity,
    @Param('friendId', ParseIntPipe) friendId: number,
  ) {
    await this.friendsService.deleteFriendRelation(user.id, friendId);

    return '친구 신청이 취소되었습니다.';
  }

  @Post('allow/:senderId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '친구 신청 수락 API' })
  @ApiOkResponse({ description: '친구 신청 수락 성공' })
  async allowFriendRequest(
    @User() user: UserEntity,
    @Param('senderId', ParseIntPipe) senderId: number,
  ): Promise<string> {
    await this.friendsService.allowFriendRequest({ senderId, receiverId: user.id });
    return '친구 신청을 수락했습니다.';
  }

  @Delete('allow/:senderId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '내가 받은 친구 신청 거절 API' })
  @ApiOkResponse({ description: '친구 신청 거절 성공' })
  async rejectFriendRequest(
    @User() user: UserEntity,
    @Param('senderId', ParseIntPipe) senderId: number,
  ): Promise<string> {
    await this.friendsService.cancelFriendRequest({ senderId, receiverId: user.id });
    return '친구 신청을 거절했습니다.';
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
