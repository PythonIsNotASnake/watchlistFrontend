import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", loadChildren: () => import("./pages/overview/overview.module").then(m => m.OverviewModule) },
  { path: "detail/:id", loadChildren: () => import("./pages/detailview/detailview.module").then(m => m.DetailviewModule) },
  { path: "administration/:id", loadChildren: () => import("./pages/createview/createview.module").then(m => m.CreateviewModule) },
  { path: "administration", loadChildren: () => import("./pages/createview/createview.module").then(m => m.CreateviewModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
