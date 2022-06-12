import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterProjectTypeCardComponent } from './filter-project-type-card.component';

describe('FilterProjectTypeCardComponent', () => {
  let component: FilterProjectTypeCardComponent;
  let fixture: ComponentFixture<FilterProjectTypeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterProjectTypeCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterProjectTypeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
