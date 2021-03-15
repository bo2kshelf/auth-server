import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AuthModule} from './auth/auth.module';
import {AppConfig} from './configs/app.config';
import {PrismaModule} from './prisma/prisma.module';

@Module({
  imports: [ConfigModule.forFeature(AppConfig), PrismaModule, AuthModule],
})
export class AppModule {}
