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

  updateUserInfo(userInfo: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/user`, userInfo);
  }

  getUploadUrl(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/avatar`);
  }

  uploadFile(signedUrl: string, file: any): Observable<any> {
    return this.http.put<any>(signedUrl, file);
  }
}
