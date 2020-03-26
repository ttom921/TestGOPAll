import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DVRcarComponent } from './dvrcar.component';

describe('DVRcarComponent', () => {
  let component: DVRcarComponent;
  let fixture: ComponentFixture<DVRcarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DVRcarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DVRcarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
