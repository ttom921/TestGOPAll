import { TestBed } from '@angular/core/testing';

import { GetCarListService } from './get-car-list.service';

describe('GetCarListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetCarListService = TestBed.get(GetCarListService);
    expect(service).toBeTruthy();
  });
});
