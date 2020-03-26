import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedAngularMaterialModule } from '../share/shared-angular-material/shared-angular-material.module';
import { DashboardComponent } from './dashboard.component';
import { CarPanelComponent } from './car-panel/car-panel.component';
import { CarRoomComponent } from './car-room/car-room.component';
import { CarRoom264Component } from './car-room264/car-room264.component';

@NgModule({
  declarations: [DashboardComponent, CarPanelComponent, CarRoomComponent, CarRoom264Component],
  imports: [
    CommonModule,
    FormsModule,
    SharedAngularMaterialModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
