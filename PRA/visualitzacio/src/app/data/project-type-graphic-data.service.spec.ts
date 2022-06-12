import { TestBed } from '@angular/core/testing';

import { ProjectTypeGraphicDataService } from './project-type-graphic-data.service';

describe('ProjectTypeGraphicDataService', () => {
  let service: ProjectTypeGraphicDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectTypeGraphicDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
