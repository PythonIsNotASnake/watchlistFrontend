import { NgModule, APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { NZ_I18N } from "ng-zorro-antd/i18n";
import { de_DE } from "ng-zorro-antd/i18n";
import { registerLocaleData } from "@angular/common";
import de from "@angular/common/locales/de";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { IconsProviderModule } from "./icons-provider.module";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { AppConfigService } from "./app.config.service";

import { NzNotificationModule } from "ng-zorro-antd/notification";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzStepsModule } from "ng-zorro-antd/steps";
import { NzResultModule } from "ng-zorro-antd/result";
import { NgxEchartsModule } from "ngx-echarts";

registerLocaleData(de);

export function appConfigInit(appConfigService: AppConfigService) {
  return () => {
    return appConfigService.load()
  };
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzBreadCrumbModule,
    NzNotificationModule,
    NzCardModule,
    NzIconModule,
    NzStatisticModule,
    NzModalModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzToolTipModule,
    NzStepsModule,
    NzResultModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts")
    })
  ],
  providers: [
    {
      provide: NZ_I18N,
      useValue: de_DE
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appConfigInit,
      multi: true,
      deps: [AppConfigService]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
