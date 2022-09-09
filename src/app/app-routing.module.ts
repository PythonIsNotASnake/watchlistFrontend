import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/overview/overview.module').then(m => m.OverviewModule) },
  { path: 'detailview/:id', loadChildren: () => import('./pages/detailview/detailview.module').then(m => m.DetailviewModule) },
  { path: 'createview/:id', loadChildren: () => import('./pages/createview/createview.module').then(m => m.CreateviewModule) },
  { path: 'createview', loadChildren: () => import('./pages/createview/createview.module').then(m => m.CreateviewModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
