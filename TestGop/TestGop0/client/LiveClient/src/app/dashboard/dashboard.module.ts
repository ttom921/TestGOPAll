import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedAngularMaterialModule } from '../share/shared-angular-material/shared-angular-material.module';
import { DashboardComponent } from './dashboard.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { LiveshowComponent } from './liveshow/liveshow.component';
import { CarRoomComponent } from './car-room/car-room.component';
import { HomeComponent } from './home/home.component';
import { CarRoom264Component } from './car-room264/car-room264.component';

@NgModule({
  declarations: [DashboardComponent, LoginComponent, LiveshowComponent, CarRoomComponent, HomeComponent, CarRoom264Component],
  imports: [
    CommonModule,
    FormsModule,
    SharedAngularMaterialModule,
    DashboardRoutingModule
  ],
  exports: [CarRoom264Component]
})
export class DashboardModule { }
