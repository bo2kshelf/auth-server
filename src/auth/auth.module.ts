import {HttpModule, Module} from '@nestjs/common';
import {ConfigModule, ConfigType} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {AccountsModule} from '../accounts/accounts.module';
import {AuthConfig} from './auth.config';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {LocalAuthGuard} from './local-auth.guard';
import {LocalStrategy} from './local.strategy';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forFeature(AuthConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(AuthConfig)],
      inject: [AuthConfig.KEY],
      useFactory: async (config: ConfigType<typeof AuthConfig>) => ({
        secret: config.jwt.secret,
        signOptions: {expiresIn: 60 * 60},
      }),
    }),
    AccountsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalAuthGuard],
})
export class AuthModule {}
