import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlightService } from '../flight.service';
import { catchError, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { Flight } from './contracts/Flight';
import { ExchangeRates } from './contracts/ExchangeRates';

@Component({
  selector: 'app-flight-form',
  templateUrl: './flight-form.component.html',
  styleUrls: ['./flight-form.component.css'],
})
export class FlightFormComponent implements OnInit, OnDestroy {
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
  selectedCurrency = 'USD';
  originalFlightPrice = 0;

  private unsubscribe$ = new Subject<void>();

  constructor(private flightService: FlightService) {}

  ngOnInit() {
    this.selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';
    this.loadExchangeRates();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadExchangeRates(): void {
    this.flightService
      .getExchangeRates(this.selectedCurrency)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((rates: ExchangeRates) => {
        if (rates && rates.rates) {
          this.currencyRates = rates.rates;
          if (!this.selectedCurrency) {
            this.selectedCurrency = Object.keys(this.currencyRates)[0];
          }
          this.updatePrices();
        }
      });
  }

  onSubmit(): void {
    const originUpperCase = this.origin.toUpperCase();
    const destinationUpperCase = this.destination.toUpperCase();

    if (originUpperCase.length < 3 || destinationUpperCase.length < 3) {
      alert('El origen y el destino deben tener al menos 3 caracteres.');
      return;
    }

    if (originUpperCase === destinationUpperCase) {
      alert('La ciudad de origen y de destino no pueden ser las mismas.');
      return;
    }

    if (
      !this.isValidInput(originUpperCase) ||
      !this.isValidInput(destinationUpperCase)
    ) {
      this.warningMessage = 'Entrada no válida';
      return;
    }

    this.selectedCurrency = 'USD'; // Establecer USD como la moneda seleccionada por defecto
    this.loadExchangeRates();

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
          this.warningMessage = errorMessage.replace('An operation error occurred: ', '');
          return of(null);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((flight: Flight | null) => {
        if (flight) {
          this.flight = flight;
          this.originalFlightPrice = flight.Price;
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

  convertToUppercase(field: 'origin' | 'destination'): void {
    const value = this[field] as string;
    const lettersOnly = value.replace(/[^A-Za-z]/g, '');
    this[field] = lettersOnly.toUpperCase();
  }

  isValidInput(value: string): boolean {
    this.warningMessage = '';

    const regex = new RegExp('^[A-Za-z]{3}$');
    return regex.test(value);
  }

  updatePrices(): void {
    if (this.currencyRates[this.selectedCurrency]) {
      this.flight.Price =
        this.originalFlightPrice * this.currencyRates[this.selectedCurrency];
      localStorage.setItem('selectedCurrency', this.selectedCurrency);
    }
  }

  getObjectKeys(obj: object): string[] {
    return Object.keys(obj);
  }
}
