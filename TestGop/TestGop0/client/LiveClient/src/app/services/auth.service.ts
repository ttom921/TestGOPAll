import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import * as jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //BASE_URL: string = environment.SERVER_URL + "/auth";
  BASE_URL: string = environment.SERVER_URL;

  public currentUserSubject: BehaviorSubject<User>;
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem("currentUser")));
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  login(username: string, password: string) {
    let url: string = `${this.BASE_URL}/login`;
    return this.http.post<any>(url, { username, password })
      .pipe(map(data => {
        // 登人成功
        let user: User = new User();
        if (data && data.auth_token) {
          var decoded = jwt_decode(data.auth_token);
          //console.log(decoded);
          //console.log(decoded.data);
          //資料轉換

          user.id = decoded.data.id;
          user.username = decoded.data.username;
          user.token = data.auth_token;

          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  /**
    * 如果有取得token，表示使用者有登入系統
    * @returns {boolean}
    */
  private hasToken(): boolean {
    //let res = localStorage.getItem('currentUser');
    //console.log("hasToken->" + res);
    return !!localStorage.getItem('currentUser');
  }
  /**
    *
    * @returns {Observable<T>}
    */
  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

}
