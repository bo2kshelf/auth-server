import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {PrismaModule} from '../prisma/prisma.module';
import {AccountsConfig} from './accounts.config';
import {AccountsService} from './accounts.service';

@Module({
  imports: [PrismaModule, ConfigModule.forFeature(AccountsConfig)],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
