import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreFileComponent } from './store-file.component';

describe('StoreFileComponent', () => {
  let component: StoreFileComponent;
  let fixture: ComponentFixture<StoreFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
