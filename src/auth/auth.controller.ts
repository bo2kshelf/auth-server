import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LocalAuthGuard} from './local-auth.guard';
import {InternalSession} from './session.type';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Body('username') username: string,
    @Session() session: InternalSession,
  ): Promise<void> {
    try {
      const payload = await this.authService.generateSessionPayload(username);
      session.accountId = payload.accountId;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('token')
  async token(@Session() session: InternalSession) {
    try {
      const accountId = session.accountId;
      if (!accountId) throw new BadRequestException();

      const accessToken = await this.authService.generateAccessToken(accountId);
      return accessToken;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
