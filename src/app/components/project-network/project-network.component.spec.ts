import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectNetworkComponent } from './project-network.component';

describe('ProjectNetworkComponent', () => {
  let component: ProjectNetworkComponent;
  let fixture: ComponentFixture<ProjectNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
