import { Controller, Get, UseGuards } from '@nestjs/common';
import { NaverAuthGuard } from './guards/naverAuth.guard';
import { User } from './utils/user.decorator';
import { CreateUserDto } from './dto/createUserDto';
import { AuthService } from './auth.service';
import { CreateUserResponseDto } from './dto/createUserResponseDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('naver/login')
  @UseGuards(NaverAuthGuard)
  naverLogin(): void {}

  @Get('naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverLoginCallback(@User() user: CreateUserDto): Promise<CreateUserResponseDto> {
    const userId = await this.authService.login(user);

    return { userId };
  }
}
