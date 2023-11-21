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

  @Get('search/:userId')
  @UseGuards(JwtAuthGuard)
  getFriendsManageList(
    @Param('userId', ParseIntPipe) userId: number,
  ): Array<SearchUserResponseDto[] | StrangerResponseDto[]> {
    const friends = await this.friendsService.getFriendsList(userId);
    return;
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
}
