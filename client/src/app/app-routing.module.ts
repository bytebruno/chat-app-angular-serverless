import { Auth0LoginComponent } from './core/auth/auth0-login/auth0-login.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: '',
    component: Auth0LoginComponent,
  },
  // {
  //   path: 'weather',
  //   loadChildren: () =>
  //     import('./features/weather/weather.module').then((m) => m.WeatherModule),
  // },
  {
    path: '**',
    redirectTo: '',
  },
];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
