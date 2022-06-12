import { TestBed } from '@angular/core/testing';

import { InternalProjectsGraphicDataService } from './internal-projects-graphic-data.service';

describe('InternalProjectsGraphicDataService', () => {
  let service: InternalProjectsGraphicDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternalProjectsGraphicDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
