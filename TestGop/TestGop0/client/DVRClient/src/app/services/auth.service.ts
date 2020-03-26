import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { Car } from '../models/car';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  BASE_URL: string = environment.SERVER_URL;
  public currentCarSubject: BehaviorSubject<Car>;
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {
    this.currentCarSubject = new BehaviorSubject<Car>(JSON.parse(localStorage.getItem("currentCar")));
  }
  public get currentCarValue(): Car {
    return this.currentCarSubject.value;
  }

  login(username: string, password: string) {
    let url: string = `${this.BASE_URL}/carlogin`;
    return this.http.post<any>(url, { username, password }).pipe(
      map(data => {
        //登人成功
        let car: Car = new Car();
        if (data && data.auth_token) {
          var decode = jwt_decode(data.auth_token);
          //console.log(decoded);
          console.log(decode.data);
          //資料轉換
          car.id = decode.data.id;
          car.username = decode.data.username;
          car.token = data.auth_token;
          // 儲存車子jwt token在 in local storage to keep car logged in between page refreshes
          localStorage.setItem('currentCar', JSON.stringify(car));
          this.currentCarSubject.next(car);
        }
        return car;
      })
    );
  }
  logout() {
    // remove car from local storage to log car out
    localStorage.removeItem('currentCar');
    this.currentCarSubject.next(null);

  }
  /**
     * 如果有取得token，表示使用者有登入系統
     * @returns {boolean}
     */
  private hasToken(): boolean {
    let res = localStorage.getItem('currentCar');
    console.log("hasToken->" + res);
    return !!localStorage.getItem('currentCar');
  }
  /**
    *
    * @returns {Observable<T>}
    */
  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }
}
