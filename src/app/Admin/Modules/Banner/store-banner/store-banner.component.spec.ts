import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreBannerComponent } from './store-banner.component';

describe('StoreBannerComponent', () => {
  let component: StoreBannerComponent;
  let fixture: ComponentFixture<StoreBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
