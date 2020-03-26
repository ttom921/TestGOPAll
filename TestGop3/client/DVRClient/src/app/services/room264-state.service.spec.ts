import { TestBed } from '@angular/core/testing';

import { Room264StateService } from './room264-state.service';

describe('Room264StateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Room264StateService = TestBed.get(Room264StateService);
    expect(service).toBeTruthy();
  });
});
