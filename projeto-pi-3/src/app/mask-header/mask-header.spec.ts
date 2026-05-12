import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaskHeader } from './mask-header';

describe('MaskHeader', () => {
  let component: MaskHeader;
  let fixture: ComponentFixture<MaskHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaskHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaskHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
