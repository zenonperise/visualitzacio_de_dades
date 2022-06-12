import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralGraphicComponent } from './general-graphic.component';

describe('GeneralGraphicComponent', () => {
  let component: GeneralGraphicComponent;
  let fixture: ComponentFixture<GeneralGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralGraphicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
