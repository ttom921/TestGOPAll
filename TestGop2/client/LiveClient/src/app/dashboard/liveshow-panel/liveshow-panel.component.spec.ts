import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveshowPanelComponent } from './liveshow-panel.component';

describe('LiveshowPanelComponent', () => {
  let component: LiveshowPanelComponent;
  let fixture: ComponentFixture<LiveshowPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveshowPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveshowPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
