import { Module } from '@nestjs/common';

import { LicenseModule } from '@kb-commands';
import { KbLoggerService } from '@kb-logger';


@Module({
  imports: [
    LicenseModule
  ],
  providers: [ KbLoggerService ]
})
export class AppModule {}
