import { Component, OnInit } from "@angular/core";
import axios, { Axios } from "axios";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { RecordModel } from "src/app/models/record";
import { ResponseRecordsModel } from "src/app/models/response-records";
import { BaseApiService } from "src/app/services/base.api.service";
import { AppConfigService } from "../../app.config.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.css"]
})

export class OverviewComponent implements OnInit {

  options: any;

  public sortDirection = "ASC";
  public sortValue = "title";
  public start = 1;
  public limit = 10;
  public total = 10;
  public records: RecordModel[] = [];
  public filterTitle = "";

  public baseUrl = "";

  ngOnInit(): void {
    this.baseUrl = this.config.baseApi;
  }

  async deleteRecord(id: number) {
    const axios = require("axios").default;
    const instance = axios.create({
      baseURL: this.baseUrl,
    });
    try {
      await instance.delete("/records/" + id);
      this.loadDataFromServer(1, this.limit);
      this.notification.create(
        "success",
        "Deleted",
        "Record was successfully deleted.",
        {
          nzAnimate: true,
          nzClass: "notification"
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
  ): void {
    this.start = pageIndex;
    this.limit = pageSize;
    const axios = require("axios").default;
    const instance = axios.create({
      baseURL: this.baseUrl,
    });
    instance.get("/records/?sortDirection=" + this.sortDirection + "&sortValue=" + this.sortValue + "&start=" + (pageIndex-1) + "&limit=" + pageSize + "&filterTitle=" + this.filterTitle)
    .then((response: any) => {
      const recordsResponse: ResponseRecordsModel = response.data;
      this.records = recordsResponse.data;
      this.total = recordsResponse.total;
    })
    .catch(function (error: any) {
      // handle error
    })
    .then(function () {
      // always executed
    });
  }

  search(searchInput: any) {
    this.filterTitle = searchInput.filterTitle;
    this.loadDataFromServer(1, 10);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.loadDataFromServer(pageIndex, pageSize);
  }

  constructor(
    private notification: NzNotificationService,
    private config: AppConfigService,
    public sanitizer: DomSanitizer,
    private baseApi: BaseApiService) {}

}
