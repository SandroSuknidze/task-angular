import { Component, inject, OnInit } from '@angular/core';
import { HousingLocation } from '../../services/product/housing-location';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-housing-location-form',
  templateUrl: './housing-location-form.component.html',
  styleUrls: ['./housing-location-form.component.css'], // Corrected 'styleUrl' to 'styleUrls'
})
export class HousingLocationFormComponent implements OnInit {
  housingLocation: HousingLocation = {} as HousingLocation;
  isEditMode: boolean = false;
  housingLocationId: number | null = null;
  fb = inject(NonNullableFormBuilder);
  imageError: string | null = null;
  imagePreview: string | null = null;

  housingLocationForm = this.fb.group({
    name: ['', { validators: [Validators.required] }],
    city: ['', Validators.required],
    state: ['', Validators.required],
    photo: ['', Validators.required],
    availableUnits: [0, [Validators.required, Validators.min(0)]],
    wifi: [false],
    laundry: [false],
  });

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.housingLocationId = +id;
      this.productService
        .getAllHousingLocationById(this.housingLocationId)
        .then((location) => {
          this.housingLocation = location;
          this.housingLocationForm.patchValue(location); // Populate form with existing data
          this.imagePreview = `data:image/jpeg;base64,${location.photo}`; // Set the image preview if needed
        })
        .catch((error) => {
          console.error('Error fetching housing location:', error);
          this.router.navigate(['/error'], {
            queryParams: { message: 'Location not found' },
          });
        });
    }
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        this.imageError = 'Only JPEG, PNG, and GIF files are allowed.';
        this.imagePreview = null;
        this.housingLocationForm.patchValue({ photo: '' });
        return;
      }
      this.imageError = null;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.housingLocationForm.patchValue({ photo: this.imagePreview });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.housingLocationForm.valid) {
      const cardData: HousingLocation = {
        id: this.isEditMode ? this.housingLocationId! : 0,
        name: this.housingLocationForm.value.name!,
        city: this.housingLocationForm.value.city!,
        state: this.housingLocationForm.value.state!,
        photo: this.housingLocationForm.value.photo!,
        availableUnits: this.housingLocationForm.value.availableUnits!,
        wifi: this.housingLocationForm.value.wifi!,
        laundry: this.housingLocationForm.value.laundry!,
      };

      if (this.isEditMode) {
        this.productService.updateHousingLocation(cardData).then(() => {
          this.router.navigate(['/']);
        }).catch((error) => {
          console.error('Error updating housing location:', error);
        });
      } else {
        this.productService.createHousingLocation(cardData).then(() => {
          this.router.navigate(['/']);
        }).catch((error) => {
          console.error('Error creating housing location:', error);
        });
      }
    }
  }
}
