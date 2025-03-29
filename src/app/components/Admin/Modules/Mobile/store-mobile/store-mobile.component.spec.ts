import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreMobileComponent } from './store-mobile.component';

describe('StoreMobileComponent', () => {
  let component: StoreMobileComponent;
  let fixture: ComponentFixture<StoreMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
