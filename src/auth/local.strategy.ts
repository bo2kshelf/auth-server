import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy as BaseLocalStrategy} from 'passport-local';
import {AccountsService} from '../accounts/accounts.service';
import {AuthService} from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(BaseLocalStrategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly accountsService: AccountsService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<boolean> {
    const userId = await this.authService.getUserId({uniqueName: username});
    if (!userId) throw new UnauthorizedException();

    const account = await this.accountsService.findAccount({userId});
    if (!account) throw new UnauthorizedException();

    const result = await this.accountsService.validateAccount(
      account,
      password,
    );
    if (result) return true;
    throw new UnauthorizedException();
  }
}
