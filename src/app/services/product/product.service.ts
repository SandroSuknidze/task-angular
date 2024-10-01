import { Injectable } from '@angular/core';
import { HousingLocation } from './housing-location';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url: string;

  constructor() {
    this.url = `${window.location.protocol}//${window.location.hostname}:5125/api`;
  }

  async getAllHousingLocations(): Promise<HousingLocation[]> {
    const data = await fetch(`${this.url}/cards`);
    return await data.json() ?? {};
  }

  async deleteHousingLocation(id: number): Promise<HousingLocation[]> {
    const response = await fetch(`${this.url}/cards/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error(`Error deleting housing location: ${response.statusText}`);
    }

    return this.getAllHousingLocations();
}
}