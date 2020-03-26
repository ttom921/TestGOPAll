import { TestBed } from '@angular/core/testing';

import { CarnamespaceService } from './carnamespace.service';

describe('CarnamespaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CarnamespaceService = TestBed.get(CarnamespaceService);
    expect(service).toBeTruthy();
  });
});
