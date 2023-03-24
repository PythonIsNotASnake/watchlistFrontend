import { Component, OnInit } from "@angular/core";
import axios, { Axios } from "axios";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { AccessTokenModel } from "src/app/models/access-token";
import { DropboxAccessTokenResponseModel } from "src/app/models/dropbox-access-token-response";
import { DropboxAuthorizationCodeModel } from "src/app/models/dropbox-authorization-code";
import { MastodonAuthorizationCredentialsModel } from "src/app/models/mastodon-authorization-credentials";
import { StatisticModel } from "src/app/models/statistic";
import { BaseApiService } from "src/app/services/base.api.service";
import { DropboxLoginService } from "src/app/services/dropbox.login.service";
import { AppConfigService } from "../../app.config.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})

export class DashboardComponent implements OnInit {

  options: any;
  public genreCount = 0;
  public recordCount = 0;
  public data: any = [];

  public dropboxIsVisible = false;
  public dropboxIsLoggedIn = false;
  dropboxAuthCode?: string;
  dropboxIsLoading = false;

  public mastodonIsVisible = false;
  public mastodonIsLoggedIn = false;
  public mastodonProgress: number = 0;
  mastodonIsLoading = false;
  mastodonAuthCode?: string;
  mastodonBaseUrl?: string;
  mastodonFullUrl?: string;

  public baseUrl = "";
  public dropboxUrl = "";
  public mastodonUrl = "";

  ngOnInit(): void {
    this.baseUrl = this.config.baseApi;
    this.dropboxUrl = this.config.dropboxUrl + "&client_id=" + this.config.dropboxClientId;
    this.mastodonUrl = this.config.mastodonUrl + "&client_id=" + this.config.mastodonClientId + "&redirect_uri=" + this.config.mastodonRedirectUri;

    this.getStatistic();
    this.isDropboxAuthorized();
    this.isMastodonAuthorized();

    this.options = {
      tooltip: {
        trigger: "item"
      },
      series: [
        {
          name: "Genre",
          type: "pie",
          radius: "100%",
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center"
          },
          labelLine: {
            show: false
          },
          data: this.data,
        }
      ],
    }
  }

  getStatistic() {
    const axios = require("axios").default;
    const instance = axios.create({
      baseURL: this.baseUrl,
      timeout: 1000,
    });
    instance.get("/statistic")
    .then((response: any) => {
      const statisticResponse: StatisticModel = response.data;
      this.genreCount = statisticResponse.genreCount;
      this.recordCount = statisticResponse.recordCount;

      let usageCount = 0;
      const genreList: any[] = statisticResponse.genrePopularityList;

      let genreLength = 0;
      if (genreList.length < 5) {
        genreLength = genreList.length;
      } else {
        genreLength = 5;
      }

      for (let i = 0; i < genreLength; i++) {
        const genreRating = {
          value: genreList[i].usageInRecords,
          name: genreList[i].genre
        };
        this.data.push(genreRating);
        usageCount = usageCount + genreList[i].usageInRecords;
      }

      if (genreList.length > 5) {
        const other = {
          value: this.recordCount - usageCount,
          name: "Others"
        };
        this.data.push(other);
      }
    })
    .catch(function (error: any) {
      // handle error
    })
    .then(function () {
      // always executed
    });
  }

  isDropboxAuthorized(): void {
    this.dropboxIsLoggedIn = this.dropboxLoginService.isLoggedIn();
  }

  logoutDropbox() {
    this.dropboxLoginService.clearLogin();
    this.dropboxIsLoggedIn = false;
  }

  async handleDropboxOk(auth: any) {
    this.dropboxAuthCode = auth.dropboxAuthCode;
    this.dropboxIsLoading = true;
    const data: DropboxAuthorizationCodeModel = {"authorizationCode": auth.dropboxAuthCode};

    try {
      const response = await axios.post(this.baseUrl + "/dropbox/authorize", data);
      if (response.data.access_token) {
        const accessTokenResponse: DropboxAccessTokenResponseModel = response.data;
        this.notification.create(
          "success",
          "Authorized",
          "You have successfully linked your dropbox with WatchList.",
          {
            nzAnimate: true,
            nzClass: "notification"
          }
        );
        this.dropboxLoginService.saveLoginTimestamp();
        this.dropboxLoginService.saveAccessToken(accessTokenResponse.access_token);
        this.dropboxIsLoggedIn = true;
        this.dropboxIsLoading = false;
        this.dropboxIsVisible = false;
      } else {
        this.notification.create(
          "error",
          "Not authorized",
          "Something went wrong. Unfortunately WatchList could not be linked to your dropbox.",
          {
            nzAnimate: true,
            nzClass: "notification"
          }
        );
        this.dropboxIsLoggedIn = false;
        this.dropboxIsLoading = false;
      }
    } catch (error) {
      console.error(error);
      this.dropboxIsVisible = true;
      this.notification.create(
        "error",
        "Not authorized",
        "Something went wrong. Unfortunately, WatchList could not be linked to your dropbox.",
        {
          nzAnimate: true,
          nzClass: "notification"
        }
      );
      this.dropboxIsLoggedIn = false;
      this.dropboxIsLoading = false;
    }
  }

  handleDropboxCancel(): void {
    this.dropboxIsVisible = false;
  }

  setDropboxVisible(): void {
    this.dropboxIsVisible = true;
  }

  async storeInDropbox() {
    try {
      const accessToken = this.dropboxLoginService.getAccessToken();
      const data: AccessTokenModel = {"accessToken": accessToken};
      const response = await axios.post(this.baseUrl + "/backups/store", data);
      const status = response.status;
      if (status === 200 || status === 201) {
        this.notification.create(
          "success",
          "Stored",
          "Backup was created successfully.",
          {
            nzAnimate: true,
            nzClass: "notification"
          }
        );
      } else {
        this.notification.create(
          "error",
          "Backup failed",
          "Something went wrong. Unfortunately, no backup could be created.",
          {
            nzAnimate: true,
            nzClass: "notification"
          }
        );
      }
    } catch (error) {
      console.error(error);
      this.notification.create(
        "error",
        "Backup failed",
        "Something went wrong. Unfortunately, no backup could be created.",
        {
          nzAnimate: true,
          nzClass: "notification"
        }
      );
    }
  }

  async restoreFromDropbox() {
    try {
      const accessToken = this.dropboxLoginService.getAccessToken();
      const data: AccessTokenModel = {"accessToken": accessToken};
      const response = await axios.post(this.baseUrl + "/backups/restore", data);
      const status = response.status;
      if (status === 200 || status === 201) {
        this.notification.create(
          "success",
          "Restored",
          "Backup was successfully applied. Please reload the page.",
          {
            nzAnimate: true,
            nzClass: "notification"
          }
        );
      } else {
        this.notification.create(
          "error",
          "Restore failed",
          "Something went wrong. Unfortunately, no data could be recovered.",
          {
            nzAnimate: true,
            nzClass: "notification"
          }
        );
      }
    } catch (error) {
      console.error(error);
      this.notification.create(
        "error",
        "Restore failed",
        "Something went wrong. Unfortunately, no data could be recovered.",
        {
          nzAnimate: true,
          nzClass: "notification"
        }
      );
    }
  }

  async isMastodonAuthorized() {
    try {
      const response = await axios.get(this.baseUrl + "/mastodon/authorized");
      this.mastodonIsLoggedIn = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async logoutMastodon() {
    try {
      const response = await axios.post(this.baseUrl + "/mastodon/logout");
      this.mastodonIsLoggedIn = !response.data;
    } catch (error) {
      console.error(error);
    }
  }

  setMastodonProgress(progress: number) {
    this.mastodonProgress = progress;
  }

  handleMastodonBaseUrl(urlForm: any) {
    this.mastodonBaseUrl = urlForm.mastodonBaseUrl;
    if (!this.mastodonBaseUrl?.startsWith("https://")) {
      this.mastodonBaseUrl = "https://" + this.mastodonBaseUrl;
    }
    if (!this.mastodonBaseUrl?.endsWith("/")) {
      this.mastodonBaseUrl = this.mastodonBaseUrl + "/";
    }
    this.mastodonFullUrl = this.mastodonBaseUrl + this.mastodonUrl;
    this.setMastodonProgress(1);
  }

  async handleMastodonOk(auth: any) {
    this.mastodonAuthCode = auth.mastodonAuthCode;
    this.mastodonIsLoading = true;
    const data: MastodonAuthorizationCredentialsModel = {
      "authorizationCode": this.mastodonAuthCode ? this.mastodonAuthCode : "", 
      "mastodonUrl": this.mastodonBaseUrl ? this.mastodonBaseUrl : ""
    };
    
    try {
      const response = await axios.post(this.baseUrl + "/mastodon/authorize", data);
      if (response.data) {
        this.notification.create(
          "success",
          "Authorized",
          "You have successfully linked mastodon with WatchList.",
          {
            nzAnimate: true,
            nzClass: "notification"
          }
        );
        this.mastodonIsLoggedIn = true;
        this.mastodonIsLoading = false;
        this.setMastodonProgress(2);
      } else {
        this.notification.create(
          "error",
          "Not authorized",
          "Something went wrong. Unfortunately, WatchList could not be linked to your mastodon account.",
          {
            nzAnimate: true,
            nzClass: "notification"
          }
        );
        this.mastodonIsLoggedIn = false;
        this.mastodonIsLoading = false;
      }
    } catch (error) {
      console.error(error);
      this.mastodonIsVisible = true;
      this.notification.create(
        "error",
        "Not authorized",
        "Something went wrong. Unfortunately, WatchList could not be linked to your mastodon account.",
        {
          nzAnimate: true,
          nzClass: "notification"
        }
      );
      this.mastodonIsLoggedIn = false;
      this.mastodonIsLoading = false;
    }
  }

  handleMastodonFinish(): void {
    this.setMastodonProgress(0);
    this.mastodonIsVisible = false;
  }

  handleMastodonCancel(): void {
    this.mastodonIsLoggedIn = false;
    this.setMastodonProgress(0);
    this.mastodonIsVisible = false;
  }

  setMastodonVisible(): void {
    this.mastodonIsVisible = true;
  }

  constructor(
    private notification: NzNotificationService, 
    private config: AppConfigService, 
    private baseApi: BaseApiService, 
    private dropboxLoginService: DropboxLoginService) {}
  
}
