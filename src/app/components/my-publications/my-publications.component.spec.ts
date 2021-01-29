import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPublicationsComponent } from './my-publications.component';

describe('MyPublicationsComponent', () => {
  let component: MyPublicationsComponent;
  let fixture: ComponentFixture<MyPublicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPublicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
