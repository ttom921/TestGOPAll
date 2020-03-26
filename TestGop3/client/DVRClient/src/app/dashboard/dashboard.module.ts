import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedAngularMaterialModule } from '../share/shared-angular-material/shared-angular-material.module';
import { DashboardComponent } from './dashboard.component';
import { CarPanelComponent } from './car-panel/car-panel.component';
import { CarRoom264Component } from './car-room264/car-room264.component';
import { FoldTestComponent } from './fold-test/fold-test.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DashboardComponent, CarPanelComponent, CarRoom264Component, FoldTestComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedAngularMaterialModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
