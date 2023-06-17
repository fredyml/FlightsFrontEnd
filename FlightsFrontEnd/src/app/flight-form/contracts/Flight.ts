import {FlightDetail} from './FlightDetail';

export interface Flight {
    Origin: string;
    Destination: string;
    Price: number;
    Flights: FlightDetail[];
  }