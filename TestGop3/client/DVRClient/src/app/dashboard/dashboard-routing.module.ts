import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CarPanelComponent } from './car-panel/car-panel.component';
import { FoldTestComponent } from './fold-test/fold-test.component';

const routes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { path: '', redirectTo: 'carpanel', pathMatch: 'full' },
      { path: 'carpanel', component: CarPanelComponent },
      { path: 'foldertest', component: FoldTestComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
