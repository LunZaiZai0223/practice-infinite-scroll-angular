import { TestBed } from '@angular/core/testing';

import { AirlineStoreService } from './airline-store.service';

describe('AirlineStoreService', () => {
  let service: AirlineStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirlineStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
