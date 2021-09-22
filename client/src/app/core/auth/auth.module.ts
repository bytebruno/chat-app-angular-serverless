import { Auth0LoginComponent } from './auth0-login/auth0-login.component';
import { AuthModule as Auth0Module } from '@auth0/auth0-angular';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TokenInterceptor } from './services/token.interceptor.service';
import { environment } from '../../../environments/environment';
@NgModule({
  declarations: [Auth0LoginComponent],
  imports: [
    CommonModule,
    ButtonModule,
    Auth0Module.forRoot({
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId,
    }),
  ],
  exports: [Auth0LoginComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
})
export class AuthModule {}
