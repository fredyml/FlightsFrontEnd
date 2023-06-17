import { Component } from '@angular/core';
import { FlightService } from '../flight.service';

@Component({
  selector: 'app-flight-form',
  templateUrl: './flight-form.component.html',
  styleUrls: ['./flight-form.component.css']
})
export class FlightFormComponent {
  origin = '';
  destination = '';
  flight: any = {
    Journey: {
      Flights: []
    }
  };

  constructor(private flightService: FlightService) { }

  onSubmit(): void {
    const originUpperCase = this.origin.toUpperCase();
    const destinationUpperCase = this.destination.toUpperCase();

    if (originUpperCase === destinationUpperCase || !this.isValidInput(originUpperCase) || !this.isValidInput(destinationUpperCase)) {
      return;
    }

    this.flightService.getFlight(originUpperCase, destinationUpperCase)
      .subscribe(flight => this.flight = flight);
  }

  validateInput(event: KeyboardEvent, field: keyof FlightFormComponent): void {
    const input = event.key;
    const validCharacters = /^[A-Za-z]$/;
    const isBackspace = event.key === 'Backspace';

    if (!validCharacters.test(input) && !isBackspace) {
      event.preventDefault();
    }
  }

  convertToUppercase(field: keyof FlightFormComponent): void {
    const value = this[field as keyof FlightFormComponent] as string;
    const lettersOnly = value.replace(/[^A-Za-z]/g, '');
    this[field as keyof FlightFormComponent] = lettersOnly.toUpperCase();
  }

  isValidInput(value: string): boolean {
    const validCharacters = /^[A-Za-z]+$/;
    return validCharacters.test(value);
  }
}
