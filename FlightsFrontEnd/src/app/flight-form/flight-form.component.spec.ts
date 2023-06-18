import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FlightFormComponent } from './flight-form.component';
import { FlightService } from '../flight.service';
import { of } from 'rxjs';

describe('FlightFormComponent', () => {
  let component: FlightFormComponent;
  let flightService: FlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlightFormComponent],
      imports: [HttpClientModule],
      providers: [
        FlightFormComponent,
        { provide: FlightService, useValue: { getExchangeRates: () => of({ rates: { USD: 1, EUR: 0.85 } }) } }
      ]
    });

    component = TestBed.inject(FlightFormComponent);
    flightService = TestBed.inject(FlightService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load exchange rates on initialization', () => {
    spyOn(flightService, 'getExchangeRates').and.callThrough();
    component.ngOnInit();
    expect(flightService.getExchangeRates).toHaveBeenCalled();
  });

  it('should update prices after loading exchange rates', () => {
    component.currencyRates = { USD: 1, EUR: 0.85 };
    component.originalFlightPrice = 100;
    component.updatePrices();
    expect(component.flight.Price).toBe(100);
    component.selectedCurrency = 'EUR';
    component.updatePrices();
    expect(component.flight.Price).toBe(85);
  });
});

describe('FlightService', () => {
  let service: FlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [FlightService],
    });

    service = TestBed.inject(FlightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
