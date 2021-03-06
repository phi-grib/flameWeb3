import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualitConformalComponent } from './qualit-conformal.component';

describe('QualitConformalComponent', () => {
  let component: QualitConformalComponent;
  let fixture: ComponentFixture<QualitConformalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualitConformalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualitConformalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
