import { Injectable } from '@angular/core';
import { HousingLocation } from './housing-location';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url: string;

  constructor() {
    this.url = `${window.location.protocol}//${window.location.hostname}:5125/api`;
  }

  async getAllHousingLocations(): Promise<HousingLocation[]> {
    const data = await fetch(`${this.url}/cards`);
    return (await data.json()) ?? {};
  }

  async deleteHousingLocation(id: number): Promise<HousingLocation[]> {
    const response = await fetch(`${this.url}/cards/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error deleting housing location: ${response.statusText}`
      );
    }

    return this.getAllHousingLocations();
  }

  async getAllHousingLocationById(id: number) {
    try {
      const response = await fetch(`${this.url}/cards/${id}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return data ?? {};
    } catch (error) {
      console.error('Failed to fetch housing location:', error);
      throw error;
    }
  }

  async createHousingLocation(housingLocation: HousingLocation): Promise<void> {
    try {
      const response = await fetch(`${this.url}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(housingLocation),
      });

      if (!response.ok) {
        throw new Error(
          `Error creating housing location: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error('Error creating housing location:', error);
      throw error;
    }
  }

  async updateHousingLocation(housingLocation: HousingLocation): Promise<void> {
    try {
      const response = await fetch(`${this.url}/cards`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(housingLocation),
      });

      if (!response.ok) {
        throw new Error(
          `Error creating housing location: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error('Error creating housing location:', error);
      throw error;
    }
  }
}
