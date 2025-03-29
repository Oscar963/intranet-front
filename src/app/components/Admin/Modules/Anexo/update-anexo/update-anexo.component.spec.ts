import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAnexoComponent } from './update-anexo.component';

describe('UpdateAnexoComponent', () => {
  let component: UpdateAnexoComponent;
  let fixture: ComponentFixture<UpdateAnexoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAnexoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAnexoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
