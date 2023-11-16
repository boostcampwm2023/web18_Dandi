import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { NaverAuthGuard } from './guards/naverAuth.guard';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { User } from './utils/user.decorator';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDto, CreateUserResponseDto } from './dto/user.dto';

@ApiTags('Authentication API')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('naver/login')
  @UseGuards(NaverAuthGuard)
  @ApiOperation({
    description: '네이버 소셜 로그인/회원가입을 위한 요청 api',
  })
  naverLogin(): void {}

  @Get('naver/callback')
  @UseGuards(NaverAuthGuard)
  @ApiOperation({
    description: '네이버 소셜 로그인 콜백 API',
  })
  @ApiResponse({ status: 200, description: '소셜 로그인 성공', type: CreateUserResponseDto })
  async naverLoginCallback(@User() user: CreateUserDto, @Res() res: Response): Promise<void> {
    const loginResult = await this.authService.login(user);

    res.cookie('utk', loginResult.token, { httpOnly: true });
    res.status(200).json({ userId: loginResult.userId });
  }
}
