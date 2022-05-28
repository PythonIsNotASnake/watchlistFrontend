import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';

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
    NzPaginationModule,
    NzCardModule,
    NzIconModule,
    NzStatisticModule,
    NzGridModule
  ],
  declarations: [OverviewComponent],
  exports: [OverviewComponent]
})
export class OverviewModule { }
