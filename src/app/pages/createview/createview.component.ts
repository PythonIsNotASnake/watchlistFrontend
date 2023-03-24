import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd/notification";
import axios, { Axios } from "axios";
import { AppConfigService } from "../../app.config.service";
import { RecordModel } from "src/app/models/record";

@Component({
  selector: "app-createview",
  templateUrl: "./createview.component.html",
  styleUrls: ["./createview.component.css"]
})
export class CreateviewComponent implements OnInit {

  safeSrc = {};
  public id: any;
  isUpdate: boolean = false;
  isLoading = false;
  title = "";
  description = "";
  genre = "";
  link = "";
  youtubeStartUrl = "https://www.youtube.com/embed/";

  public baseUrl = "";

  ngOnInit(): void {
    this.baseUrl = this.config.baseApi;

    this.route.paramMap.subscribe(params => {
      this.id = params.get("id")
    });

    if (this.id != null && this.id !== "") {
      this.isUpdate = true;
      this.getRecord(this.id);
    }

    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      "http://www.youtube.com/embed/" +
      "?enablejsapi=1"
      );
    const axios = require("axios").default;
  }

 async getRecord(id: String) {
    try {
      const response = await axios.get(this.baseUrl + "/records/" + id);
      this.title = response.data.title;
      this.description = response.data.description;
      this.genre = response.data.genre;
      var fullUrl: string;
      fullUrl = response.data.link;
      this.link = fullUrl.substring(29);
      this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        "http://www.youtube.com/embed/" +
        this.link +
        "?enablejsapi=1"
        );
    } catch (error) {
      console.error(error);
    }
 }

  async createRecord(record: RecordModel) {
    this.isLoading = true;
    record.link = this.youtubeStartUrl + record.link;
    
    try {
      const response = await axios.post(this.baseUrl + "/records", record);
      this.id = response.data.data.id;
      this.isLoading = false;
      this.notification.create(
        "success",
        "Created",
        "New record has been created.",
        {
          nzAnimate: true,
          nzClass: "notification"
        }
      );
      this.router.navigate([`/detail/${this.id}`], { relativeTo: this.route });
    } catch (error) {
      console.error(error);
      this.isLoading = false;
    }
  }

  async updateRecord(record: RecordModel) {
    this.isLoading = true;
    record.link = this.youtubeStartUrl + record.link;
    
    try {
      const response = await axios.put(this.baseUrl + "/records/" + this.id, record);
      this.isLoading = false;
      this.notification.create(
        "success",
        "Updated",
        "Record has been updated.",
        {
          nzAnimate: true,
          nzClass: "notification"
        }
      );
      this.router.navigate([`/detail/${this.id}`], { relativeTo: this.route });
    } catch (error) {
      console.error(error);
      this.isLoading = false;
    }
  }

  preview(result: any) {
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      "http://www.youtube.com/embed/" +
      result.link +
      "?enablejsapi=1"
      );
  }

  constructor(
    private sanitizer: DomSanitizer, 
    private router: Router, 
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    private config: AppConfigService) {}

}
