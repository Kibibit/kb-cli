import { CommandFactory } from 'nest-commander';

import { KbLoggerService } from '@kb-logger';

import { AppModule } from './app.module';

const loggerInstance = new KbLoggerService();

export async function bootstrap() {
  if (process.env.DEBUG) {
    await CommandFactory.run(
      AppModule,
      loggerInstance
    );
    return;
  }

  await CommandFactory.run(AppModule);
}

bootstrap();
