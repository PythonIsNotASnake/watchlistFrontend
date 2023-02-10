import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzStepsModule } from 'ng-zorro-antd/steps';

import { OverviewRoutingModule } from './overview-routing.module';

import { OverviewComponent } from './overview.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';


@NgModule({
  imports: [
    OverviewRoutingModule, 
    CommonModule,
    FormsModule,
    NzTableModule, 
    NzDividerModule,
    NzNotificationModule,
    NzPaginationModule,
    NzCardModule,
    NzIconModule,
    NzStatisticModule,
    NzGridModule,
    NzModalModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzToolTipModule,
    NzStepsModule
  ],
  declarations: [OverviewComponent],
  exports: [OverviewComponent]
})
export class OverviewModule { }
