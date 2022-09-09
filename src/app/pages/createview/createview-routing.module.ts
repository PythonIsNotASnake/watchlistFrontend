import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateviewComponent } from './createview.component';

const routes: Routes = [
  { path: '', component: CreateviewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateviewRoutingModule { }
