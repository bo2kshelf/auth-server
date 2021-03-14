import {HttpService, Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {Account} from '@prisma/client';
import {AccountsService} from '../accounts/accounts.service';
import {AuthConfig} from './auth.config';
import {Permission} from './permissions.type';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthConfig.KEY)
    private readonly config: ConfigType<typeof AuthConfig>,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly accountsService: AccountsService,
  ) {}

  async getUserId(params: {uniqueName: string}) {
    return this.httpService
      .get<{id: string}>(
        new URL('/users', this.config.api.user.endpoint).toString(),
        {params: params},
      )
      .toPromise()
      .then(({data: {id}}) => id)
      .catch(() => {});
  }

  async generateSessionPayload(username: string) {
    const uid = await this.getUserId({uniqueName: username});
    if (!uid) throw new Error();

    const account = await this.accountsService.findAccount({userId: uid});
    if (!account) throw new Error();

    return {accountId: account.id};
  }

  async resolvePermissions(account: Account): Promise<Permission[]> {
    return [
      ...(account.roles.includes('VIEWER')
        ? this.config.permissions.viewer
        : []),
      ...(account.roles.includes('LIBRARIAN')
        ? this.config.permissions.librarian
        : []),
    ];
  }

  async generateAccessToken(accountId: string): Promise<string> {
    const account = await this.accountsService.findAccount({id: accountId});
    if (!account) throw new Error();

    const permissions = await this.resolvePermissions(account);
    return this.jwtService.sign({userId: account.userId, permissions});
  }
}
