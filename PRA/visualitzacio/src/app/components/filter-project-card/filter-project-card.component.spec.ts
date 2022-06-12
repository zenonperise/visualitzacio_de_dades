import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterProjectCardComponent } from './filter-project-card.component';

describe('FilterProjectCardComponent', () => {
  let component: FilterProjectCardComponent;
  let fixture: ComponentFixture<FilterProjectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterProjectCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterProjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
