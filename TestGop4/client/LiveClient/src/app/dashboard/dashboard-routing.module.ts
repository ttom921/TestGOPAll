import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { LoginComponent } from './login/login.component';
import { LiveshowComponent } from './liveshow/liveshow.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { path: '', redirectTo: 'liveshow', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'liveshow', component: LiveshowComponent },
      { path: 'home', component: HomeComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
