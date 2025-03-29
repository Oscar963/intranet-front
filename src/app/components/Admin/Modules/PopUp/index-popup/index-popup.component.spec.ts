import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexPopupComponent } from './index-popup.component';

describe('IndexPopupComponent', () => {
  let component: IndexPopupComponent;
  let fixture: ComponentFixture<IndexPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
