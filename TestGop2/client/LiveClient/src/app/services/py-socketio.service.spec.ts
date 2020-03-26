import { TestBed } from '@angular/core/testing';

import { PySocketioService } from './py-socketio.service';

describe('PySocketioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PySocketioService = TestBed.get(PySocketioService);
    expect(service).toBeTruthy();
  });
});
