import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private apiUrl = 'https://localhost:7199/api/Flights/CalculateRoute';

  constructor(private http: HttpClient) { }

  getFlight(origin: string, destination: string) {
    const body = JSON.stringify({
      origin: origin,
      destination: destination
    });

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, body, { headers: headers });
  }
}
