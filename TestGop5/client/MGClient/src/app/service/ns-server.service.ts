import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NsServerService {

  constructor(private http: HttpClient) { }
  /**
   * getCars
  */
  public getCars(serverip: string): Observable<any> {
    let url: string = `http://${serverip}/nsserver`;
    return this.http.get<any>(url);
  }
  public getCarChannellistDetail(serverip: string, carnum: string): Observable<any> {
    const params = new HttpParams()
      .set('carnum', carnum);
    let url: string = `http://${serverip}/nsserver/getchannellistdetail`;
    return this.http.get<any>(url, { params });
  }
  public putDVRDisconnect(serverip: string, sid: string) {
    let url: string = `http://${serverip}/nsserver/DVRDisconnect`;
    return this.http.post<any>(url, { sid })
      .pipe(
        map(data => {
          console.log(data);
          return data;
        }));
  }

}
