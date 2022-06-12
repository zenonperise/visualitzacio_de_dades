import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsoluteRelativeModeCardComponent } from './absolute-relative-mode-card.component';

describe('AbsoluteRelativeModeCardComponent', () => {
  let component: AbsoluteRelativeModeCardComponent;
  let fixture: ComponentFixture<AbsoluteRelativeModeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsoluteRelativeModeCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsoluteRelativeModeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
