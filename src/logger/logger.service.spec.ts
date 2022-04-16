import { Test, TestingModule } from '@nestjs/testing';

import { KbLoggerService } from './logger.service';

describe('KbLoggerService', () => {
  let service: KbLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ KbLoggerService ]
    }).compile();

    service = module.get<KbLoggerService>(KbLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
