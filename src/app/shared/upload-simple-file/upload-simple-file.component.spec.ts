import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSimpleFileComponent } from './upload-simple-file.component';

describe('UploadSimpleFileComponent', () => {
  let component: UploadSimpleFileComponent;
  let fixture: ComponentFixture<UploadSimpleFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadSimpleFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadSimpleFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
