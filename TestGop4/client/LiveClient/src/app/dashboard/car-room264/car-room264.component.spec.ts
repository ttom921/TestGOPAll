import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarRoom264Component } from './car-room264.component';

describe('CarRoom264Component', () => {
  let component: CarRoom264Component;
  let fixture: ComponentFixture<CarRoom264Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarRoom264Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarRoom264Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
