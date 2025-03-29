import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreUserComponent } from './store-user.component';

describe('StoreUserComponent', () => {
  let component: StoreUserComponent;
  let fixture: ComponentFixture<StoreUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
