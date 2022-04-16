import { Test, TestingModule } from '@nestjs/testing';
import { PruneService } from './prune.service';

describe('PruneService', () => {
  let service: PruneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PruneService],
    }).compile();

    service = module.get<PruneService>(PruneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
