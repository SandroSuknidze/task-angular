import { Component, inject, OnInit } from '@angular/core';
import { HousingLocation } from '../../services/product/housing-location';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, NonNullableFormBuilder, Validators } from '@angular/forms';
import { read } from '@popperjs/core';

@Component({
  selector: 'app-housing-location-form',
  templateUrl: './housing-location-form.component.html',
  styleUrls: ['./housing-location-form.component.css'],
})
export class HousingLocationFormComponent implements OnInit {
  housingLocation: HousingLocation = {} as HousingLocation;
  isEditMode: boolean = false;
  housingLocationId: number | null = null;
  fb = inject(NonNullableFormBuilder);
  imageError: string | null = null;
  imagePreview: string | null = null;
  pdfError: string | null = null;

  housingLocationForm = this.fb.group({
    name: ['', { validators: [Validators.required] }],
    city: ['', Validators.required],
    state: ['', Validators.required],
    photo: ['', Validators.required],
    availableUnits: [0, [Validators.required, Validators.min(0)]],
    wifi: [false],
    laundry: [false],
    pdf: ['', Validators.required]
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

  onPdfSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    console.log(file);
    if(file) {
      const validTypes = ['application/pdf'];
      if(!validTypes.includes(file.type)) {
        this.pdfError = 'Only PDF is allowed.';
        return;
      }
      this.pdfError = null;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.housingLocationForm.patchValue({ pdf: e.target?.result as string})
      }
      reader.readAsDataURL(file);
    }
  }

  downloadPdf() {
    if(this.housingLocationId) {
      const pdfData = this.housingLocationForm.value.pdf; 

      if (pdfData) {
        const byteCharacters = atob(pdfData); // Decode base64
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
    
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
    
        // Create a temporary anchor element for download
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = 'document.pdf'; // Specify the filename
        link.click();
    
        // Clean up after download
        window.URL.revokeObjectURL(url);
      }
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
        pdf: this.housingLocationForm.value.pdf!,
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
