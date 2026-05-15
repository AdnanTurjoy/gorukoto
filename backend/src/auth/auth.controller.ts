import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.auth.me(user.id);
  }

  @Public()
  @Get('google')
  googleLogin(@Res() res: Response) {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: `${process.env.API_URL || 'http://localhost:3000'}/api/auth/google/callback`,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'online',
      prompt: 'select_account',
    });
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  }

  @Public()
  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    if (error || !code) {
      return res.redirect(`${frontendUrl}/login?error=google_denied`);
    }
    try {
      const { accessToken } = await this.auth.handleGoogleCallback(code);
      res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
    } catch {
      res.redirect(`${frontendUrl}/login?error=google_failed`);
    }
  }
}
