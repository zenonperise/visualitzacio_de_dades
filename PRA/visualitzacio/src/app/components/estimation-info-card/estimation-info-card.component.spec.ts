import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationInfoCardComponent } from './estimation-info-card.component';

describe('EstimationInfoCardComponent', () => {
  let component: EstimationInfoCardComponent;
  let fixture: ComponentFixture<EstimationInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimationInfoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimationInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
