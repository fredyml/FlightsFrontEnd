import { Component } from '@angular/core';
import { FlightService } from '../flight.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-flight-form',
  templateUrl: './flight-form.component.html',
  styleUrls: ['./flight-form.component.css']
})
export class FlightFormComponent {
  origin = '';
  destination = '';
  flight: any = {
      Origin: '',
      Destination: '',
      Price: 0,
      Flights: []
  };
  
  warningMessage = '';

  constructor(private flightService: FlightService) {
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

    this.flightService.getFlight(originUpperCase, destinationUpperCase).pipe(
      catchError((error) => {
        console.error(error);
        this.flight = {
          Origin: '',
          Destination: '',
          Price: 0,
          Flights: []
        };
        const errorMessage = error.error ? error.error : 'Hubo un error al buscar vuelos. Intente de nuevo.';
        window.alert(errorMessage.replace('An operation error occurred: ', ''));
        return of(null);
      })
    ).subscribe(flight => {
      if(flight){
        this.flight = flight;
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
}
