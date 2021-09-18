import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export const API_ENDPOINT = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class UserInformationService {
  constructor(private http: HttpClient) {}

  getOneUserInfo(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user`);
  }
}
