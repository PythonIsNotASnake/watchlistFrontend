import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CreateviewRoutingModule } from './createview-routing.module';

import { CreateviewComponent } from './createview.component';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzNotificationModule } from 'ng-zorro-antd/notification';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CreateviewRoutingModule,
    NzFormModule,
    NzInputModule,
    NzNotificationModule,
    NzButtonModule
  ],
  declarations: [CreateviewComponent],
  exports: [CreateviewComponent]
})
export class CreateviewModule { }
