import { TestBed } from '@angular/core/testing';

import { EstimationDataService } from './estimation-data.service';

describe('EstimationDataService', () => {
  let service: EstimationDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstimationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
