import { Module } from '@nestjs/common';

import { LicenseModule } from '@kb-commands';
import { KbLoggerService } from '@kb-logger';

import { PruneModule } from './commands/prune/prune.module';


@Module({
  imports: [
    LicenseModule,
    PruneModule
  ],
  providers: [ KbLoggerService ]
})
export class AppModule {}
