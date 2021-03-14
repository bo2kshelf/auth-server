import {registerAs} from '@nestjs/config';

export const AuthConfig = registerAs('auth', () => ({
  api: {
    user: {
      endpoint: process.env.USER_API_ENDPOINT!,
    },
  },
  jwt: {
    secret: process.env.AUTH_SERVER_JWT_SECRET!,
  },
  permissions: {
    viewer: [
      // myself
      'read:myself',
      'update:myself',
      // user
      'read:users',
      // contents
      'read:contents',
      // myrecords
      'read:myrecords',
      'update:myrecords',
      'create:myrecords',
      'delete:myrecords',
      // records
      'read:records',
    ] as const,
    librarian: [
      // contents
      'create:contents',
      'update:contents',
      'delete:contents',
    ] as const,
  },
}));
