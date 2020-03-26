import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarloginRoutingModule } from './carlogin-routing.module';
import { CarloginComponent } from './carlogin.component';
import { FormsModule } from '@angular/forms';
import { SharedAngularMaterialModule } from '../share/shared-angular-material/shared-angular-material.module';

@NgModule({
  declarations: [CarloginComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedAngularMaterialModule,
    CarloginRoutingModule
  ]
})
export class CarloginModule { }
