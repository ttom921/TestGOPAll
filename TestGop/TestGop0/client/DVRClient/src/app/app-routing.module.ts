import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'carlogin', loadChildren: () => import('./carlogin/carlogin.module').then(m => m.CarloginModule) },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    //enableTracing: true,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
