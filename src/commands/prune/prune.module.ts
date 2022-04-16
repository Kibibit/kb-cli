import { Module } from '@nestjs/common';

import { KbLoggerService } from '@kb-logger';

import { PruneCommand } from './prune.command';
import { PruneService } from './prune.service';

@Module({
  providers: [
    KbLoggerService,
    PruneService,
    PruneCommand
  ]
})
export class PruneModule {}
