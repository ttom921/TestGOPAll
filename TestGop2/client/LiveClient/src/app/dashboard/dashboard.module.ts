import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedAngularMaterialModule } from '../share/shared-angular-material/shared-angular-material.module';
import { DashboardComponent } from './dashboard.component';
import { LiveshowPanelComponent } from './liveshow-panel/liveshow-panel.component';
import { CarRoom264Component } from './car-room264/car-room264.component';

@NgModule({
  declarations: [DashboardComponent, LiveshowPanelComponent, CarRoom264Component],
  imports: [
    CommonModule,
    SharedAngularMaterialModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
