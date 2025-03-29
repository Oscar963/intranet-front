import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileIndexPageComponent } from './file-index-page.component';

describe('FileIndexPageComponent', () => {
  let component: FileIndexPageComponent;
  let fixture: ComponentFixture<FileIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
