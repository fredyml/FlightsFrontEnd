import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FlightService } from '../flight.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface ExchangeRates {
  rates: {
    [key: string]: number;
  };
}

@Component({
  selector: 'app-flight-form',
  templateUrl: './flight-form.component.html',
  styleUrls: ['./flight-form.component.css'],
})
export class FlightFormComponent implements OnInit {
  origin = '';
  destination = '';
  flight: any = {
    Origin: '',
    Destination: '',
    Price: 0,
    Flights: [],
  };

  warningMessage = '';
  currencyRates: { [key: string]: number } = {};
  selectedCurrency = '';

  constructor(private flightService: FlightService) {}

  ngOnInit() {
    this.selectedCurrency = localStorage.getItem('selectedCurrency') || '';
    this.loadExchangeRates();
  }
  
  loadExchangeRates(): void {
    this.flightService.getExchangeRates(this.selectedCurrency).subscribe((rates: ExchangeRates) => {
      if (rates && rates.rates) {
        this.currencyRates = rates.rates;
        if (!this.selectedCurrency) {
          this.selectedCurrency = Object.keys(this.currencyRates)[0];
        }
        this.updatePrices();
      }
    });
  }
  

  ngOnChanges(changes: SimpleChanges) {
    if (changes['flight'] && !changes['flight'].firstChange) {
      this.updatePrices();
    }
  }

  onSubmit(): void {
    const originUpperCase = this.origin.toUpperCase();
    const destinationUpperCase = this.destination.toUpperCase();

    if (
      !this.isValidInput(originUpperCase) ||
      !this.isValidInput(destinationUpperCase)
    ) {
      this.warningMessage = 'Entrada no válida';
      return;
    }

    this.flightService
      .getFlight(originUpperCase, destinationUpperCase)
      .pipe(
        catchError((error) => {
          console.error(error);
          this.flight = {
            Origin: '',
            Destination: '',
            Price: 0,
            Flights: [],
          };
          const errorMessage = error.error
            ? error.error
            : 'Hubo un error al buscar vuelos. Intente de nuevo.';
          window.alert(errorMessage.replace('An operation error occurred: ', ''));
          return of(null);
        })
      )
      .subscribe((flight) => {
        if (flight) {
          this.flight = flight;
          this.updatePrices();
          this.warningMessage = '';
        }
      });
  }

  validateInput(event: KeyboardEvent, field: keyof FlightFormComponent): void {
    const input = event.key;
    const validCharacters = /^[A-Za-z]$/;
    const isBackspace = event.key === 'Backspace';
    const isTab = event.key === 'Tab';
    const isEnter = event.key === 'Enter';

    if (!validCharacters.test(input) && !isBackspace && !isTab && !isEnter) {
      event.preventDefault();
    }
  }

  convertToUppercase(field: keyof FlightFormComponent): void {
    const value = this[field] as string;
    const lettersOnly = value.replace(/[^A-Za-z]/g, '');
    this[field] = lettersOnly.toUpperCase();
  }

  isValidInput(value: string): boolean {
    this.warningMessage = '';

    if (this.origin.toUpperCase() === this.destination.toUpperCase()) {
      this.warningMessage = 'El origen y el destino no pueden ser iguales';
      return false;
    }

    const validCharacters = /^[A-Za-z]+$/;
    return validCharacters.test(value);
  }

  updatePrices(): void {
    if (this.flight.Price && this.currencyRates[this.selectedCurrency]) {
      this.flight.Price = this.flight.Price / this.currencyRates[this.selectedCurrency];
    }
  
    if (this.flight.Flights) {
      this.flight.Flights.forEach((flightDetail: any) => {
        if (flightDetail.Price && this.currencyRates[this.selectedCurrency]) {
          flightDetail.Price = flightDetail.Price / this.currencyRates[this.selectedCurrency];
        }
      });
    }
  
    localStorage.setItem('selectedCurrency', this.selectedCurrency);
  }
  

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
