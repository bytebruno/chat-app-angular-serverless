import { Component, OnInit } from '@angular/core';

import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth0-login',
  templateUrl: './auth0-login.component.html',
  styleUrls: ['./auth0-login.component.scss'],
})
export class Auth0LoginComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      console.log('TENTOU NAVEGAR');
      if (isAuthenticated) this.router.navigateByUrl('/chat');
    });
  }

  public redirectToLogin() {
    this.auth.loginWithRedirect({
      redirect_uri: 'http://localhost:4200',
    });
  }
}
