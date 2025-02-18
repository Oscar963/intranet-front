import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSimpleImg2Component } from './upload-simple-img-2.component';

describe('UploadSimpleImg2Component', () => {
  let component: UploadSimpleImg2Component;
  let fixture: ComponentFixture<UploadSimpleImg2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadSimpleImg2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadSimpleImg2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
