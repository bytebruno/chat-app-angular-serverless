// src/app/auth/token.interceptor.ts

import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, delay, switchMap, tap } from 'rxjs/operators';

import { AuthService } from '@auth0/auth0-angular';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenInterceptor implements HttpInterceptor {
  private idToken: string | undefined = undefined;
  private _refreshSubject: Subject<any> = new Subject<any>();

  constructor(private auth: AuthService) {
    this.idTokenSubscription();
  }

  private idTokenSubscription() {
    this.auth.idTokenClaims$.subscribe((idTokenClaims) => {
      this.idToken = idTokenClaims?.__raw;
      this._refreshSubject.next(this.idToken);
    });
  }

  private _ifTokenExpired() {
    this._refreshSubject
      .pipe(
        delay(1),
        tap(() => {
          if (this.idToken !== undefined) {
            this._refreshSubject.next(this.idToken);
            this._refreshSubject.complete();
          }
        })
      )
      .subscribe({
        next: (token) => {
          console.log(token);
          return token;
        },
        complete: () => {
          this._refreshSubject = new Subject<any>();
        },
      });
    if (this.idToken !== undefined) this._refreshSubject.next(this.idToken);
    return this._refreshSubject;
  }

  private _checkTokenExpiryErr(error: HttpErrorResponse): boolean {
    return (error.status && error.status === 401) || error.status === 403;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error, caught) => {
        if (error instanceof HttpErrorResponse) {
          if (this._checkTokenExpiryErr(error)) {
            return this._ifTokenExpired().pipe(
              switchMap(() => {
                return next.handle(this.updateHeader(req));
              })
            );
          } else {
            return throwError(error);
          }
        }
        return caught;
      })
    );
  }

  updateHeader(req: HttpRequest<any>) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.idToken}`),
    });
    return req;
  }
}
