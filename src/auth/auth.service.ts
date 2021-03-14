import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {Account} from '@prisma/client';
import {AccountsService} from '../accounts/accounts.service';
import {AuthConfig} from './auth.config';
import {Sdk} from './codegen/users-api';
import {Permission} from './permissions.type';

export const GRAPHQL_REQUEST_SDK_KEY = 'UsersApiTypeSafeGqlSdk';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthConfig.KEY)
    private readonly config: ConfigType<typeof AuthConfig>,
    @Inject(GRAPHQL_REQUEST_SDK_KEY)
    private readonly gqlSdk: Sdk,
    private readonly jwtService: JwtService,
    private readonly accountsService: AccountsService,
  ) {}

  async getUserId(args: {uniqueName: string}): Promise<string | undefined> {
    return this.gqlSdk.ResolveUserId(args).then(({user: {id}}) => id);
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
