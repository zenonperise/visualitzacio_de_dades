import { TestBed } from '@angular/core/testing';

import { SummaryDataService } from './summary-data.service';

describe('SummaryDataService', () => {
  let service: SummaryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummaryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
