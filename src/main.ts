import {ConfigType} from '@nestjs/config';
import {NestFactory} from '@nestjs/core';
import * as session from 'express-session';
import {AppConfig} from './app.config';
import {AppModule} from './app.module';
import MongoStore = require('connect-mongo');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config: ConfigType<typeof AppConfig> = app.get(AppConfig.KEY);

  app.enableCors({
    origin: true,
    credentials: true,
  });
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
