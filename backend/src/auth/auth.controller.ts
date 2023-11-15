import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { NaverAuthGuard } from './guards/naverAuth.guard';
import { User } from './utils/user.decorator';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('naver/login')
  @UseGuards(NaverAuthGuard)
  naverLogin(): void {}

  @Get('naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverLoginCallback(@User() user: CreateUserDto, @Res() res: Response): Promise<void> {
    const loginResult = await this.authService.login(user);

    res.cookie('utk', loginResult.token, { httpOnly: true, maxAge: 3600000 });
    res.json({ userId: loginResult.userId, accessToken: user.accessToken });
  }
}
