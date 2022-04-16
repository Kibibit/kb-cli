
import { Module } from '@nestjs/common';

import { KbLoggerService } from '@kb-logger';

import { LicenseCommand } from './license.command';


@Module({
  providers: [
    KbLoggerService,
    LicenseCommand
  ]
})
export class LicenseModule {}
