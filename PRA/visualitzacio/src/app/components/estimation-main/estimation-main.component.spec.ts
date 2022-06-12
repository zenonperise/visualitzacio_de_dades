import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationMainComponent } from './estimation-main.component';

describe('EstimationMainComponent', () => {
  let component: EstimationMainComponent;
  let fixture: ComponentFixture<EstimationMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimationMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimationMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
