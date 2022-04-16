import { Module } from '@nestjs/common';

import { GithooksModule, LicenseModule, PruneModule } from '@kb-commands';
import { KbLoggerService } from '@kb-logger';


@Module({
  imports: [
    LicenseModule,
    PruneModule,
    GithooksModule
  ],
  providers: [ KbLoggerService ]
})
export class AppModule {}
