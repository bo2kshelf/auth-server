import {registerAs} from '@nestjs/config';

export const AppConfig = registerAs('app', () => ({
  session: {
    secret: process.env.SESSION_SECRET!,
    store: {mongoUrl: process.env.AUTH_SERVER_MONGO_URI!},
  },
}));
