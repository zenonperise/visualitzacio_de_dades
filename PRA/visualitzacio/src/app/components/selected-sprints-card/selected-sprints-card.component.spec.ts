import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedSprintsCardComponent } from './selected-sprints-card.component';

describe('SelectedSprintsCardComponent', () => {
  let component: SelectedSprintsCardComponent;
  let fixture: ComponentFixture<SelectedSprintsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedSprintsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedSprintsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
