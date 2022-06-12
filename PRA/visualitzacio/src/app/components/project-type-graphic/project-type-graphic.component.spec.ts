import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTypeGraphicComponent } from './project-type-graphic.component';

describe('ProjectTypeGraphicComponent', () => {
  let component: ProjectTypeGraphicComponent;
  let fixture: ComponentFixture<ProjectTypeGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectTypeGraphicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTypeGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
