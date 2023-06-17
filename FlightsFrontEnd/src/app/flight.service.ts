import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ExchangeRates {
  rates: {
    [key: string]: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private apiUrl = 'https://localhost:7199/api/Flights/CalculateRoute';
  private exchangeApiUrl = 'https://api.exchangerate-api.com/v4/latest/';

  constructor(private http: HttpClient) {}

  getFlight(origin: string, destination: string) {
    const body = JSON.stringify({
      origin: origin,
      destination: destination,
    });

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiUrl, body, { headers: headers });
  }

  getExchangeRates(baseCurrency: string): Observable<ExchangeRates> {
    const url = `${this.exchangeApiUrl}${baseCurrency}`;

    return this.http.get<ExchangeRates>(url);
  }
}
