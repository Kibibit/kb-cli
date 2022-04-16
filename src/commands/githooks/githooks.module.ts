import { Module } from '@nestjs/common';

import { KbLoggerService } from '@kb-logger';

import { PruneService } from '../prune/prune.service';
import { DisallowBranchCommand } from './disallow-branch.command';
import { GithooksService } from './githooks.service';

@Module({
  providers: [
    KbLoggerService,
    PruneService,
    GithooksService,
    DisallowBranchCommand
  ]
})
export class GithooksModule {}
