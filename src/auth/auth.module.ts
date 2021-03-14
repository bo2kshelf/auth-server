import {
  GraphQLClientInject,
  GraphQLRequestModule,
} from '@golevelup/nestjs-graphql-request';
import {Module} from '@nestjs/common';
import {ConfigModule, ConfigType} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {GraphQLClient} from 'graphql-request';
import {AccountsModule} from '../accounts/accounts.module';
import {AuthConfig} from './auth.config';
import {AuthController} from './auth.controller';
import {AuthService, GRAPHQL_REQUEST_SDK_KEY} from './auth.service';
import {getSdk} from './codegen/users-api';
import {LocalAuthGuard} from './local-auth.guard';
import {LocalStrategy} from './local.strategy';

@Module({
  imports: [
    AccountsModule,
    ConfigModule.forFeature(AuthConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(AuthConfig)],
      inject: [AuthConfig.KEY],
      useFactory: async (config: ConfigType<typeof AuthConfig>) => ({
        secret: config.jwt.secret,
        signOptions: {expiresIn: 60 * 60},
      }),
    }),
    GraphQLRequestModule.forRootAsync(GraphQLRequestModule, {
      imports: [ConfigModule.forFeature(AuthConfig)],
      inject: [AuthConfig.KEY],
      useFactory: async (config: ConfigType<typeof AuthConfig>) => ({
        endpoint: config.api.endpoints,
        options: {headers: {Authorization: 'Bearer ' + config.api.token}},
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: GRAPHQL_REQUEST_SDK_KEY,
      inject: [GraphQLClientInject],
      useFactory: (client: GraphQLClient) => getSdk(client),
    },
    AuthService,
    LocalStrategy,
    LocalAuthGuard,
  ],
})
export class AuthModule {}
