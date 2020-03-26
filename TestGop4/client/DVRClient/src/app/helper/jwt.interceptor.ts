import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let currentCar = this.authService.currentCarValue;
    if (currentCar && currentCar.token) {
      request = request.clone({
        setHeaders: {
          authorization: `Bearer ${currentCar.token}`
        }
      });
    }
    return next.handle(request);
  }
}
