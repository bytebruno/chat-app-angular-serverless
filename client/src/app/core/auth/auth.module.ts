import { Auth0LoginComponent } from './auth0-login/auth0-login.component';
import { AuthModule as Auth0Module } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { environment } from '../../../environments/environment';

@NgModule({
  declarations: [Auth0LoginComponent],
  imports: [
    CommonModule,
    Auth0Module.forRoot({
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId,
    }),
  ],
  exports: [Auth0LoginComponent],
})
export class AuthModule {}
