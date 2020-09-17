import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdocumentoComponent } from './subdocumento.component';

describe('SubdocumentoComponent', () => {
  let component: SubdocumentoComponent;
  let fixture: ComponentFixture<SubdocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubdocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubdocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
