import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiService {
  constructor(private http: Http) {
  }

  public getUsers(): Observable<any> {
    return this.http
      .get('./assets/users.json')
      .map(res => res.json());
  }
}
