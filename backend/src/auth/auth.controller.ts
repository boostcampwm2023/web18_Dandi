import { Controller, Get, UseGuards } from '@nestjs/common';
import { NaverAuthGuard } from './guards/naverAuth.guard';
import { User } from './utils/user.decorator';
import { CreateUserDto } from './dto/createUserDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('naver/login')
  @UseGuards(NaverAuthGuard)
  naverLogin(): void {}

  @Get('naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverLoginCallback(@User() user: CreateUserDto): Promise<number> {
    return await this.authService.login(user);
  }
}
