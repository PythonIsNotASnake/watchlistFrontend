import { NgModule } from '@angular/core';

import { DetailviewRoutingModule } from './detailview-routing.module';

import { DetailviewComponent } from './detailview.component';


@NgModule({
  imports: [DetailviewRoutingModule],
  declarations: [DetailviewComponent],
  exports: [DetailviewComponent]
})
export class DetailviewModule { }
