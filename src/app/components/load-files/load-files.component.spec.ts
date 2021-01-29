import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadFilesComponent } from './load-files.component';

describe('LoadFilesComponent', () => {
  let component: LoadFilesComponent;
  let fixture: ComponentFixture<LoadFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
