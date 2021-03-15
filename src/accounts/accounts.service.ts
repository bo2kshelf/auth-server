import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {Account, Prisma} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {PrismaService} from '../prisma/prisma.service';
import {AccountsConfig} from './accounts.config';

@Injectable()
export class AccountsService {
  constructor(
    @Inject(AccountsConfig.KEY)
    private readonly config: ConfigType<typeof AccountsConfig>,
    private readonly prismaService: PrismaService,
  ) {}

  async findAccount(where: Prisma.AccountWhereUniqueInput) {
    return this.prismaService.account.findUnique({where});
  }

  async validateAccount(account: Account, password: string): Promise<boolean> {
    return bcrypt.compare(password, account.password);
  }
}
