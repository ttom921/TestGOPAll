import { TestBed } from '@angular/core/testing';

import { NsServerService } from './ns-server.service';

describe('NsServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NsServerService = TestBed.get(NsServerService);
    expect(service).toBeTruthy();
  });
});
