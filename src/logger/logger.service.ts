import { magenta, red, yellow } from 'chalk';

import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class KbLoggerService implements LoggerService {
  log(message: string, ...optionalParams: unknown[]) {
    console.log(message, optionalParams);
  }
  error(message: string, ...optionalParams: unknown[]) {
    console.error(red(message), optionalParams);
  }
  warn(message: string, ...optionalParams: unknown[]) {
    console.warn(yellow(message), optionalParams);
  }
  debug?(message: string, ...optionalParams: unknown[]) {
    console.debug(magenta(message), optionalParams);
  }
  verbose?(message: string, ...optionalParams: unknown[]) {
    console.debug(magenta(message), optionalParams);
  }
  // setLogLevels?(levels: LogLevel[]) {
  //   throw new Error('Method not implemented.');
  // }
}
