import { Component, inject, Output } from '@angular/core';
import { HousingLocation } from '../../services/product/housing-location';
import { ProductService } from '../../services/product/product.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  housingLocationList: HousingLocation[] = [];
  productService: ProductService = inject(ProductService);
  isAscending: boolean = true;
  
  filters: FormGroup;



  constructor() {
    this.loadHousingLocations();
    this.filters = new FormGroup({
      name: new FormControl(''),
      wifi: new FormControl(false)
    });
  }

  private loadHousingLocations(): void {
    this.productService.getAllHousingLocations()
      .then((housingLocationList: HousingLocation[]) => {
        this.housingLocationList = housingLocationList;
      });
  }

  onDeleteHousingLocation(id: number): void {
    this.housingLocationList = this.housingLocationList.filter(location => location.id !== id);
  }

  toggleSortOrder(): void {
    if(this.isAscending) {
      this.productService.sortHousingLocationByNameASC()
      .then((housingLocationList: HousingLocation[]) => {
        this.housingLocationList = housingLocationList;
      })
    } else {
      this.productService.sortHousingLocationByNameDESC()
      .then((housingLocationList: HousingLocation[]) => {
        this.housingLocationList = housingLocationList;
      })
    }

    this.isAscending = !this.isAscending;
  }


  getFilteredHousingLocations(): void {
    const filterValues = this.filters.value;
    this.productService.getFilteredHousingLocations(filterValues)
      .subscribe((data: HousingLocation[]) => {
        this.housingLocationList = data;
      });
  }

  applyFilters(): void {
    this.getFilteredHousingLocations();
  }
}
