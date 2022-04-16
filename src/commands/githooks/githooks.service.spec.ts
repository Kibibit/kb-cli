import { Test, TestingModule } from '@nestjs/testing';
import { GithooksService } from './githooks.service';

describe('GithooksService', () => {
  let service: GithooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GithooksService],
    }).compile();

    service = module.get<GithooksService>(GithooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
