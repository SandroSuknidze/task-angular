import { Component, Input } from '@angular/core';
import { HousingLocation } from '../../services/product/housing-location';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() housingLocation!:HousingLocation;

}
