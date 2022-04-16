import { Command, CommandRunner } from 'nest-commander';

import { KbLoggerService } from '@kb-logger';


@Command({
  name: 'license',
  description: 'Get license information'
})
export class LicenseCommand implements CommandRunner {
  commandName = 'license';
  constructor(
    private readonly logger: KbLoggerService
  ) {}

  async run(
    args: string[],
    options: Record<string, string | boolean>
  ): Promise<void> {
    console.log('got here!');
  }
}
