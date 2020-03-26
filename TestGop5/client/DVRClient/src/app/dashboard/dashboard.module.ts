import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedAngularMaterialModule } from '../share/shared-angular-material/shared-angular-material.module';
import { CarPanelComponent } from './car-panel/car-panel.component';
import { FormsModule } from '@angular/forms';
import { CarRoomComponent } from './car-room/car-room.component';


@NgModule({
  declarations: [DashboardComponent, CarPanelComponent, CarRoomComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedAngularMaterialModule,
    DashboardRoutingModule
  ],
  exports: [CarRoomComponent]
})
export class DashboardModule { }
