# FlightsFrontEnd
# FlightsFrontEnd Web Application

This repository contains the FlightsFrontEnd web application, which is built using Angular framework. The application is designed to consume a backend service that provides information about flights and calculates the route based on user-provided origin and destination.

## Application Details

- **Application Name**: FlightsFrontEnd
- **Framework**: Angular

## Environment Variables

The FlightsFrontEnd application relies on the following environment variables:

- **apiUrl**: Specifies the URL for the backend service that returns calculated routes. The URL is set to `'https://localhost:7199/api/Flights/CalculateRoute'`.
- **exchangeApiUrl**: Specifies the URL for the exchange rate service that allows currency conversion based on the selected currency.

## Features

The FlightsFrontEnd application includes the following features:

- **Interceptor**: Implements an interceptor that intercepts HTTP requests and responses, allowing for additional processing or manipulation.
- **Unit Testing**: Includes a suite of unit tests to ensure the functionality and behavior of the application.

## Functionality

The FlightsFrontEnd application allows users to:

- Query a service that provides information about flights.
- Calculate the route based on the user-provided origin and destination.
- Utilize a component named FlightFormComponent, which contains the main logic of the application.
- Consume a service called FlightService to interact with REST services and retrieve flight-related data.
- Use the HttpErrorInterceptor, which acts as an interceptor for handling HTTP errors.

## Getting Started

To run the FlightsFrontEnd application, follow these steps:

1. Ensure that you have the required dependencies and development environment for Angular.
2. Set the appropriate values for the environment variables mentioned above.
3. Build and run the application.

Please refer to the individual project documentation for more detailed instructions.

## License

This project is licensed under the [MIT License](LICENSE).
