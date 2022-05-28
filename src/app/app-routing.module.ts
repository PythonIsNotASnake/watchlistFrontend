import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/overview' },
  { path: 'overview', loadChildren: () => import('./pages/overview/overview.module').then(m => m.OverviewModule) },
  { path: 'detailview/:id', loadChildren: () => import('./pages/detailview/detailview.module').then(m => m.DetailviewModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
