import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUpdatePageComponent } from './file-update-page.component';

describe('FileUpdatePageComponent', () => {
  let component: FileUpdatePageComponent;
  let fixture: ComponentFixture<FileUpdatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUpdatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUpdatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
