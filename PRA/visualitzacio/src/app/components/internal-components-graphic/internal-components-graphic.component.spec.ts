import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalComponentsGraphicComponent } from './internal-components-graphic.component';

describe('InternalComponentsGraphicComponent', () => {
  let component: InternalComponentsGraphicComponent;
  let fixture: ComponentFixture<InternalComponentsGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalComponentsGraphicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalComponentsGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
