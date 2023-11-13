import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { NaverAuthGuard } from './guards/naverAuth.guard';
import { User } from './utils/user.decorator';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('naver/login')
  @UseGuards(NaverAuthGuard)
  async naverLogin(): Promise<void> {}

  @Get('naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverLoginCallback(@User() user, @Res() res): Promise<void> {
    return res.json({
      user,
    });
  }
}
