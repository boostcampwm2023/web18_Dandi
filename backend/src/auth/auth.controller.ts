import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { OAuthLoginDto, OAuthLoginResponseDto } from './dto/auth.dto';

@ApiTags('Authentication API')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({
    description: 'Oauth 로그인 검증 및 토큰 발급 API',
  })
  @ApiOkResponse({ description: '소셜 로그인 성공', type: OAuthLoginResponseDto })
  async oauthLogin(@Body() oauthLoginDto: OAuthLoginDto, @Res() res: Response): Promise<void> {
    const loginResult = await this.authService.login(oauthLoginDto);

    res.cookie('utk', loginResult.token, { httpOnly: true });
    res.json({ id: loginResult.userId });
  }

  @Get('refresh_token')
  @ApiOperation({
    description: 'access token 갱신 API',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async refreshAccessToken(@Req() req: Request, @Res() res: Response): Promise<void> {
    const newJwt = await this.authService.refreshAccessToken(req);

    res.cookie('utk', newJwt, { httpOnly: true });
    res.redirect('http://223.130.146.253/');
  }
}
