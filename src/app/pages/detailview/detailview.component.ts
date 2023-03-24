import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import axios, { Axios } from "axios";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { RecordModel } from "src/app/models/record";
import { TootModel } from "src/app/models/toot";
import { AppConfigService } from "../../app.config.service";

@Component({
  selector: "app-detailview",
  templateUrl: "./detailview.component.html",
  styleUrls: ["./detailview.component.css"]
})
export class DetailviewComponent implements OnInit {

  contentIsLoading = false;

  url = "";
  safeSrc = {};
  public id: any;
  title = "";
  description = "";
  genre = "";

  public baseUrl = "";
  mastodonIsLoggedIn = false;
  tootIsVisible = false;
  tootIsLoading = false;
  tootBody = [];

  ngOnInit(): void {
    this.contentIsLoading = true;
    this.baseUrl = this.config.baseApi;

    this.route.paramMap.subscribe(params => {
      this.id = params.get("id")
    });
    const axios = require("axios").default;
    const instance = axios.create({
      baseURL: this.baseUrl,
    });

    this.getRecord(instance);
    this.isMastodonLoggedIn();
  }

  async getRecord(instance: any) {
    try {
      const response = await instance.get("/records/" + this.id);
      const record: RecordModel = response.data;

      this.title = record.title;
      this.description = record.description;
      this.genre = record.genre;
      this.url = record.link;

      this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.url + "?enablejsapi=1");
      this.contentIsLoading = false;
    } catch (error) {
      console.error(error);
      this.contentIsLoading = false;
    }
  }

  async isMastodonLoggedIn() {
    try {
      const response = await axios.get(this.baseUrl + "/mastodon/authorized");
      this.mastodonIsLoggedIn = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  handleTootCancel(): void {
    this.tootIsVisible = false;
    this.tootIsLoading = false;
    this.cleanPreview();
  }

  cleanPreview(): void {
    this.tootBody = [];
  }

  async shareOnMastodonPreview() {
    this.tootIsLoading = true;
    const data = {
      "recordId": this.id
    };
    try {
      const response = await axios.post(this.baseUrl + "/mastodon/toot/preview", data);

      if (response.data.tootBody) {
        const text = response.data.tootBody.toString().split("\n");
        this.tootBody = text;
        this.tootIsVisible = true;
      } else {
        this.notification.create(
          "error",
          "Preview error",
          "Could not create a preview.",
          {
            nzAnimate: true,
            nzClass: "notification"
          }
        );
      }
      this.tootIsLoading = false;
    } catch (error) {
      this.tootIsLoading = false;
      console.error(error);
      this.notification.create(
        "error",
        "Preview error",
        "Could not create a preview.",
        {
          nzAnimate: true,
          nzClass: "notification"
        }
      );
    }
  }

  async shareOnMastodon() {
    this.tootIsLoading = true;
    const data: TootModel = {
      "recordId": this.id
    };
    try {
      const response = await axios.post(this.baseUrl + "/mastodon/toot", data);

      if (response.data) {
        this.notification.create(
          "success",
          "Toot",
          "Content shared on mastodon.",
          {
            nzAnimate: true,
            nzClass: "notification"
          }
        );
      } else {
        this.notification.create(
          "error",
          "Not shared",
          "Content could not shared on mastodon.",
          {
            nzAnimate: true,
            nzClass: "notification"
          }
        );
      }
      this.tootIsLoading = false;
    } catch (error) {
      this.tootIsLoading = false;
      console.error(error);
      this.notification.create(
        "error",
        "Not shared",
        "Content could not shared on mastodon.",
        {
          nzAnimate: true,
          nzClass: "notification"
        }
      );
    }
  }

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    private config: AppConfigService) {}

}
