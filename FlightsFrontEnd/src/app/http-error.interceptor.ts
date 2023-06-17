import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        console.error(error);

        const errorMessage = error.error
          ? error.error
          : 'Hubo un error en la solicitud. Intente de nuevo.';
        
        window.alert(errorMessage.replace('An operation error occurred: ', ''));

        return throwError(error);
      })
    );
  }
}
