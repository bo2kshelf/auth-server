import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppConfig} from './app.config';
import {AuthModule} from './auth/auth.module';
import {PrismaModule} from './prisma/prisma.module';

@Module({
  imports: [ConfigModule.forFeature(AppConfig), PrismaModule, AuthModule],
})
export class AppModule {}
