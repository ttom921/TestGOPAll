import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetCarListService {

  constructor(private http: HttpClient) { }
  /**
   * getCars
  */
  public getCars(serverip: string): Observable<any> {
    let url: string = `http://${serverip}/nsserver`;
    return this.http.get<any>(url);
  }
}
