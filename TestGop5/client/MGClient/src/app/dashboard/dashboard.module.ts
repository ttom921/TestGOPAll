import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { SharedAngularMaterialModule } from '../share/shared-angular-material/shared-angular-material.module';
import { CarPanelComponent } from './car-panel/car-panel.component';


@NgModule({
  declarations: [DashboardComponent, CarPanelComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedAngularMaterialModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
