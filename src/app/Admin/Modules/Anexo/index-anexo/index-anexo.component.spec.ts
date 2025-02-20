import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexAnexoComponent } from './index-anexo.component';

describe('IndexAnexoComponent', () => {
  let component: IndexAnexoComponent;
  let fixture: ComponentFixture<IndexAnexoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexAnexoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexAnexoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
