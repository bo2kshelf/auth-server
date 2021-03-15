import {registerAs} from '@nestjs/config';

export const AccountsConfig = registerAs('accounts', () => ({
  bcryptRounds: 10,
}));
