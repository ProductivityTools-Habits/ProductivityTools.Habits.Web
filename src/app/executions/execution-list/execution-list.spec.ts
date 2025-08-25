import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionList } from './execution-list';

describe('ExecutionList', () => {
  let component: ExecutionList;
  let fixture: ComponentFixture<ExecutionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
