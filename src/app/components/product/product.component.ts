import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HousingLocation } from '../../services/product/housing-location';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() housingLocation!:HousingLocation;
  @Output() delete = new EventEmitter<number>();

  constructor(private productService: ProductService) {}

  async deleteHousingLocation(id: number): Promise<void> {
    try {
      await this.productService.deleteHousingLocation(id);
      this.delete.emit(id);
    } catch (error) {
      console.error('Failed to delete housing location:', error);
    }
  }
}
