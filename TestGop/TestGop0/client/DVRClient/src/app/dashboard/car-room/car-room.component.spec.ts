import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarRoomComponent } from './car-room.component';

describe('CarRoomComponent', () => {
  let component: CarRoomComponent;
  let fixture: ComponentFixture<CarRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
