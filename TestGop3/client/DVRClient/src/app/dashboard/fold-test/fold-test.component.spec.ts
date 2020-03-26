import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoldTestComponent } from './fold-test.component';

describe('FoldTestComponent', () => {
  let component: FoldTestComponent;
  let fixture: ComponentFixture<FoldTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoldTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoldTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
