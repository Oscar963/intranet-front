import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexFileComponent } from './index-file.component';

describe('IndexFileComponent', () => {
  let component: IndexFileComponent;
  let fixture: ComponentFixture<IndexFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
