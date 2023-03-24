import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { DetailviewRoutingModule } from "./detailview-routing.module";

import { DetailviewComponent } from "./detailview.component";

import { NzDescriptionsModule } from "ng-zorro-antd/descriptions";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzNotificationModule } from "ng-zorro-antd/notification";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzSkeletonModule } from "ng-zorro-antd/skeleton";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DetailviewRoutingModule,
    NzDescriptionsModule,
    NzButtonModule,
    NzNotificationModule,
    NzModalModule,
    NzFormModule,
    NzSkeletonModule
  ],
  declarations: [DetailviewComponent],
  exports: [DetailviewComponent]
})
export class DetailviewModule { }
