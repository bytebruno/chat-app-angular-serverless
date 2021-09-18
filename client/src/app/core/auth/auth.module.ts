import { Auth0LoginComponent } from './auth0-login/auth0-login.component';
import { AuthModule as Auth0Module } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [Auth0LoginComponent],
  imports: [
    CommonModule, // Import the module into the application, with configuration
    Auth0Module.forRoot({
      domain: 'dev-iubhvavp.us.auth0.com',
      clientId: 'wanWJnwVUzARKvRHiF7sTcweYBapWgth',
    }),
  ],
  exports: [Auth0LoginComponent],
})
export class AuthModule {}
