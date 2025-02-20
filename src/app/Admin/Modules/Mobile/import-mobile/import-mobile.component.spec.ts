import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportMobileComponent } from './import-mobile.component';

describe('ImportMobileComponent', () => {
  let component: ImportMobileComponent;
  let fixture: ComponentFixture<ImportMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
