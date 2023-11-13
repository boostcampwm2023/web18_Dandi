import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { NaverAuthGuard } from './guards/naverAuth.guard';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('naver/login')
  @UseGuards(NaverAuthGuard)
  async naverLogin(): Promise<void> {}

  @Get('naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverLoginCallback(@Req() req, @Res() res): Promise<void> {
    return res.json({
      user: req.user,
    });
  }
}
