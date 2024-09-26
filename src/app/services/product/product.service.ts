import { Injectable } from '@angular/core';
import { HousingLocation } from './housing-location';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url: string;

  constructor() {
    this.url = `${window.location.protocol}//${window.location.hostname}:3000/locations`;
  }

  async getAllHousingLocations(): Promise<HousingLocation[]> {
    const data = await fetch(this.url);
    return await data.json() ?? {};
  }
}