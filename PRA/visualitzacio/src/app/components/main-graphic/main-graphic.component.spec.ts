import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainGraphicComponent } from './main-graphic.component';

describe('MainGraphicComponent', () => {
  let component: MainGraphicComponent;
  let fixture: ComponentFixture<MainGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainGraphicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
