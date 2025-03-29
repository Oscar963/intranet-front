import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAnexoComponent } from './store-anexo.component';

describe('StoreAnexoComponent', () => {
  let component: StoreAnexoComponent;
  let fixture: ComponentFixture<StoreAnexoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreAnexoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreAnexoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
