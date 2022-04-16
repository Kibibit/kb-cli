import { Command, CommandRunner } from 'nest-commander';

import { KbLoggerService } from '@kb-logger';

import { PruneService } from './prune.service';


@Command({
  name: 'prune',
  description: 'Get license information'
})
export class PruneCommand implements CommandRunner {
  commandName = 'prune';
  constructor(
    private readonly logger: KbLoggerService,
    private readonly pruneService: PruneService
  ) {}

  async run(
  // args: string[],
  // options: Record<string, string | boolean>
  ): Promise<void> {
    await this.pruneService.pruneMergedBranches();
    // console.log('got here!');
  }
}
