import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private apiUrl = 'http://localhost/api/flight';

  constructor(private http: HttpClient) { }

  getFlight(origin: string, destination: string) {
    return this.http.get(this.apiUrl, {
      params: {
        origin: origin,
        destination: destination
      }
    });
  }
}
