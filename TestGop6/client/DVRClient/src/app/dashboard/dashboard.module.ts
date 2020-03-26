import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { SharedAngularMaterialModule } from '../share/shared-angular-material/shared-angular-material.module';
import { CarPanelComponent } from './car-panel/car-panel.component';
import { CarRoom264Component } from './car-room264/car-room264.component';
import { DVRcarComponent } from './dvrcar/dvrcar.component';


@NgModule({
  declarations: [DashboardComponent, CarPanelComponent, CarRoom264Component, DVRcarComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedAngularMaterialModule,
    DashboardRoutingModule
  ],
  exports: [DVRcarComponent]
})
export class DashboardModule { }
