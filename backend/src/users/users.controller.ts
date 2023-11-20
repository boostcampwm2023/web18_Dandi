import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchUserResponseDto } from './dto/user.dto';

@ApiTags('Users API')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/search/:nickname')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: '닉네임으로 사용자 검색 API' })
  @ApiOkResponse({ description: '닉네임을 사용자 검색 성공', type: Array<SearchUserResponseDto> })
  async searchUsers(@Param('nickname') nickname: string): Promise<SearchUserResponseDto[]> {
    return this.usersService.searchUsers(nickname);
  }
}
