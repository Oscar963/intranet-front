import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinymceComponent } from './tinymce.component';

describe('TinymceComponent', () => {
  let component: TinymceComponent;
  let fixture: ComponentFixture<TinymceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TinymceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TinymceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
