import {registerAs} from '@nestjs/config';

export const AppConfig = registerAs('app', () => ({
  session: {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET!,
    store: {
      mongoUrl: process.env.SESSION_MONGO_URI!,
    },
  },
}));
