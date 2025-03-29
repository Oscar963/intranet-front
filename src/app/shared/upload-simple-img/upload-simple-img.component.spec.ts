import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSimpleImgComponent } from './upload-simple-img.component';

describe('UploadSimpleImgComponent', () => {
  let component: UploadSimpleImgComponent;
  let fixture: ComponentFixture<UploadSimpleImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadSimpleImgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadSimpleImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
