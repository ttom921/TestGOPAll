import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarloginComponent } from './carlogin.component';

const routes: Routes = [
  { path: '', component: CarloginComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarloginRoutingModule { }
