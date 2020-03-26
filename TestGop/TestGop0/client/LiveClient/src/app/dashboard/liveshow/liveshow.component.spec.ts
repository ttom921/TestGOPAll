import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveshowComponent } from './liveshow.component';

describe('LiveshowComponent', () => {
  let component: LiveshowComponent;
  let fixture: ComponentFixture<LiveshowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveshowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
