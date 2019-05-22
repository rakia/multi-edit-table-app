import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiEditTableComponent } from './multi-edit-table.component';

describe('MultiEditTableComponent', () => {
  let component: MultiEditTableComponent;
  let fixture: ComponentFixture<MultiEditTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiEditTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiEditTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
