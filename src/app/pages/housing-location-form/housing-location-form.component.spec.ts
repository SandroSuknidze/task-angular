import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingLocationFormComponent } from './housing-location-form.component';

describe('HousingLocationFormComponent', () => {
  let component: HousingLocationFormComponent;
  let fixture: ComponentFixture<HousingLocationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HousingLocationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousingLocationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
