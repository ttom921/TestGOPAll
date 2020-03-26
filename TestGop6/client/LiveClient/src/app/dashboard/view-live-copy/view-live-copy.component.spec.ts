import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLiveCopyComponent } from './view-live-copy.component';

describe('ViewLiveCopyComponent', () => {
  let component: ViewLiveCopyComponent;
  let fixture: ComponentFixture<ViewLiveCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLiveCopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLiveCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
