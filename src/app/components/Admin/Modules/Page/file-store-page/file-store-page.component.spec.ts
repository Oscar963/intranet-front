import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileStorePageComponent } from './file-store-page.component';

describe('FileStorePageComponent', () => {
  let component: FileStorePageComponent;
  let fixture: ComponentFixture<FileStorePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileStorePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileStorePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
