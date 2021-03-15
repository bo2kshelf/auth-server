import {Session} from 'express-session';

export type InternalSession = Session & {
  accountId: string;
};
