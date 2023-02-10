import { NgModule } from '@angular/core';

import { DetailviewRoutingModule } from './detailview-routing.module';

import { DetailviewComponent } from './detailview.component';

import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationModule } from 'ng-zorro-antd/notification';


@NgModule({
  imports: [
    DetailviewRoutingModule,
    NzDescriptionsModule,
    NzButtonModule,
    NzNotificationModule
  ],
  declarations: [DetailviewComponent],
  exports: [DetailviewComponent]
})
export class DetailviewModule { }
