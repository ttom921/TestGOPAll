import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLiveOneComponent } from './view-live-one.component';

describe('ViewLiveOneComponent', () => {
  let component: ViewLiveOneComponent;
  let fixture: ComponentFixture<ViewLiveOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLiveOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLiveOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
