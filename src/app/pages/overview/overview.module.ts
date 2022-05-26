import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

import { OverviewRoutingModule } from './overview-routing.module';

import { OverviewComponent } from './overview.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';


@NgModule({
  imports: [
    OverviewRoutingModule, 
    CommonModule, 
    NzTableModule, 
    NzDividerModule,
    NzNotificationModule,
    NzPaginationModule
  ],
  declarations: [OverviewComponent],
  exports: [OverviewComponent]
})
export class OverviewModule { }
