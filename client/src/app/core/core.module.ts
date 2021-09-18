import { AuthModule } from './auth/auth.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [AuthModule, CommonModule, HttpClientModule, RouterModule],
  exports: [MainLayoutComponent],
})
export class CoreModule {}
