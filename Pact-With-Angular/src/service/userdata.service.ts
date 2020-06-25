import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from '../model/user.model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  basePactUrl = 'http://127.0.0.1:1234';

  postUrl = '/user-service/users';
  getUrl = '/user-service/userId/';

  constructor(private http: HttpClient) { }

  addUser(userData: User): Observable<number> {
    return this.http
      .post(this.basePactUrl + this.postUrl, userData)
      .pipe(map(data => data['id']));
  }

  updateUser(user: User, userId: number): Observable<any> {
    return this.http.put(this.basePactUrl + this.postUrl + '/' +  userId, user);
  }

  getUser(userId: number): Observable<any> {
    return this.http.get(this.basePactUrl + this.getUrl + userId);
  }
}
