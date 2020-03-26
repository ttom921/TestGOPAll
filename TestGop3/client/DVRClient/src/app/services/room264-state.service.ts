import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Room264StateService {
  isRoomOninitSubject = new BehaviorSubject<boolean>(false);
  constructor() { }
  /**
   * name
   */
  public SetRoomOninit(isFinish: boolean) {
    this.isRoomOninitSubject.next(isFinish);
  }
  /**
    *
    * @returns {Observable<T>}
    */
  public isRoomOninit(): Observable<boolean> {
    return this.isRoomOninitSubject.asObservable();
  }
}
