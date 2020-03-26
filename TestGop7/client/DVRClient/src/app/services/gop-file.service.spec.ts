import { TestBed } from '@angular/core/testing';

import { GopFileService } from './gop-file.service';

describe('GopFileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GopFileService = TestBed.get(GopFileService);
    expect(service).toBeTruthy();
  });
});
