import {ConfigType} from '@nestjs/config';
import {NestFactory} from '@nestjs/core';
import * as session from 'express-session';
import {AppModule} from './app.module';
import {AppConfig} from './configs/app.config';
import MongoStore = require('connect-mongo');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config: ConfigType<typeof AppConfig> = app.get(AppConfig.KEY);

  app.use(
    session({
      secret: config.session.secret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({mongoUrl: config.session.store.mongoUrl}),
    }),
  );

  // eslint-disable-next-line no-process-env
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
