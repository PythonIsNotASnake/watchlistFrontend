import { NgModule } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

import { OverviewRoutingModule } from './overview-routing.module';

import { OverviewComponent } from './overview.component';


@NgModule({
  imports: [OverviewRoutingModule, NzTableModule],
  declarations: [OverviewComponent],
  exports: [OverviewComponent]
})
export class OverviewModule { }
