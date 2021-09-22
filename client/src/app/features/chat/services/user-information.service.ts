import { HttpClient } from '@angular/common/http';
import { IUploadUrlResponse } from '../models/iUploadUrlResponse';
import { IUserInfo } from '../models/iUserInfo';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export const API_ENDPOINT = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class UserInformationService {
  constructor(private http: HttpClient) {}

  getOneUserInfo(): Observable<IUserInfo> {
    return this.http.get<IUserInfo>(`${environment.apiUrl}/user`);
  }

  updateUserInfo(userInfo: IUserInfo): Observable<IUserInfo> {
    return this.http.post<IUserInfo>(`${environment.apiUrl}/user`, userInfo);
  }

  getUploadUrl(): Observable<IUploadUrlResponse> {
    return this.http.get<IUploadUrlResponse>(
      `${environment.apiUrl}/user/avatar`
    );
  }

  uploadFile(signedUrl: string, file: any): Observable<string> {
    return this.http.put<string>(signedUrl, file);
  }
}
