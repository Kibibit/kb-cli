import { Command, CommandRunner } from 'nest-commander';

import { KbLoggerService } from '@kb-logger';

import { GithooksService } from './githooks.service';


@Command({
  name: 'disallow',
  description: 'Get license information'
})
export class DisallowBranchCommand implements CommandRunner {
  commandName = 'disallow';
  constructor(
    private readonly logger: KbLoggerService,
    private readonly githooksService: GithooksService
  ) {}

  async run(
  // args: string[],
  // options: Record<string, string | boolean>
  ): Promise<void> {
    // await this.pruneService.pruneMergedBranches();
    // console.log('got here!');
    this.githooksService.disallowMainBranchesCommits();
  }
}
