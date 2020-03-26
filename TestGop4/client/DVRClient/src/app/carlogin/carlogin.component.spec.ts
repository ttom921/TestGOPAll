import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarloginComponent } from './carlogin.component';

describe('CarloginComponent', () => {
  let component: CarloginComponent;
  let fixture: ComponentFixture<CarloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
