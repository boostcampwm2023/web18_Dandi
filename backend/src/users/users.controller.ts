import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { ApiOperation } from '@nestjs/swagger';
import { SearchUserResponseDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/search/:nickname')
  @UseGuards(JwtAuthGuard)
  async searchUsers(@Param('nickname') nickname: string): Promise<SearchUserResponseDto[]> {
    return this.usersService.searchUsers(nickname);
  }
}
