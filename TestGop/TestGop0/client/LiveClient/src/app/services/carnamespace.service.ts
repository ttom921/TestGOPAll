import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarnamespaceService {
  BASE_URL: string = environment.SERVER_URL;
  constructor(private http: HttpClient) { }
  getNamespace() {
    let url: string = `${this.BASE_URL}/nsserver`;
    return this.http.get<any>(url).pipe(
      map(data => {
        //console.log(data);
        return data;
      })
    );
  }
}
