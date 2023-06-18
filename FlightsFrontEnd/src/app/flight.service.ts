import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from './flight-form/contracts/Flight';
import { environment } from '../environments/environment';

export interface ExchangeRates {
  rates: {
    [key: string]: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  constructor(private http: HttpClient) { }

  getFlight(origin: string, destination: string): Observable<Flight> {
    const body = JSON.stringify({
      origin: origin,
      destination: destination,
    });

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<Flight>(environment.apiUrl, body, { headers: headers });
  }

  getExchangeRates(baseCurrency: string): Observable<ExchangeRates> {
    const url = `${environment.exchangeApiUrl}${baseCurrency}`;

    return this.http.get<ExchangeRates>(url);
  }
}
