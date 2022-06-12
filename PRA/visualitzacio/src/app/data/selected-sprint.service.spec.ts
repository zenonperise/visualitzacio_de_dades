import { TestBed } from '@angular/core/testing';

import { SelectedSprintService } from './selected-sprint.service';

describe('SelectedSprintService', () => {
  let service: SelectedSprintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedSprintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
