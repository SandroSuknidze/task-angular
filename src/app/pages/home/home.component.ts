import { Component, inject } from '@angular/core';
import { HousingLocation } from '../../services/product/housing-location';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  housingLocationList: HousingLocation[] = [];
  productService: ProductService = inject(ProductService);


  constructor() {
    this.productService
      .getAllHousingLocations()
      .then((housingLocationList: HousingLocation[]) => {
        this.housingLocationList = housingLocationList;
      });
  }
}
