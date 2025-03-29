import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAnexoComponent } from './import-anexo.component';

describe('ImportAnexoComponent', () => {
  let component: ImportAnexoComponent;
  let fixture: ComponentFixture<ImportAnexoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportAnexoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportAnexoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
