import { AuthModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [
    AuthModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    RouterModule,
  ],
  exports: [MainLayoutComponent],
})
export class CoreModule {}
