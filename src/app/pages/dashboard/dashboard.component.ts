import { Component, OnInit } from '@angular/core';
import axios, { Axios } from 'axios';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseApiService } from 'src/app/services/base.api.service';
import { DropboxLoginService } from 'src/app/services/dropbox.login.service';
import { AppConfigService } from '../../app.config.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  options: any;
  public genreCount = 0;
  public recordCount = 0;
  public data: any = [];

  public dropboxIsVisible = false;
  public dropboxIsLoggedIn = false;
  dropboxAuthCode?: string;

  public mastodonIsVisible = false;
  public mastodonIsLoggedIn = false;
  public mastodonProgress: number = 0;
  mastodonAuthCode?: string;
  mastodonBaseUrl?: string;
  mastodonFullUrl?: string;

  public baseUrl = '';
  public dropboxUrl = '';
  public mastodonUrl = '';

  ngOnInit(): void {
    this.baseUrl = this.config.baseApi;
    this.dropboxUrl = this.config.dropboxUrl + "&client_id=" + this.config.dropboxClientId;
    this.mastodonUrl = this.config.mastodonUrl + "&client_id=" + this.config.mastodonClientId + "&redirect_uri=" + this.config.mastodonRedirectUri;

    this.getStatistic();
    this.isDropboxAuthorized();
    this.isMastodonAuthorized();

    this.options = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Genre',
          type: 'pie',
          radius: '100%',
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
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
    const axios = require('axios').default;
    const instance = axios.create({
      baseURL: this.baseUrl,
      timeout: 1000,
    });
    instance.get('/statistic')
    .then((response: any) => {
      this.genreCount = response.data.genreCount;
      this.recordCount = response.data.recordCount;

      let usageCount = 0;
      const genreList: any[] = response.data.genrePopularityList;
      for (let i = 0; i < genreList.length; i++) {
        const genreRating = {
          value: genreList[i].usageInRecords,
          name: genreList[i].genre
        };
        this.data.push(genreRating);
        usageCount = usageCount + genreList[i].usageInRecords;
      }

      const other = {
        value: this.recordCount - usageCount,
        name: 'Andere'
      };
      this.data.push(other);
    })
    .catch(function (error: any) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }

  isDropboxAuthorized(): void {
    this.dropboxIsLoggedIn = this.dropboxLoginService.isLoggedIn();
  }

  logoutDropbox() {
    this.dropboxLoginService.clearLoginTimestamp();
    this.dropboxIsLoggedIn = false;
  }

  async handleDropboxOk(auth: any) {
    this.dropboxAuthCode = auth.dropboxAuthCode;
    const data = {"authorizationCode": auth.dropboxAuthCode};
    
    try {
      const response = await axios.post(this.baseUrl + '/dropbox/authorize', data);
      if (response.data) {
        this.notification.create(
          'success',
          'Authorisiert',
          'Sie haben WatchList erfolgreich mit Dropbox verknüpft.',
          {
            nzAnimate: true,
            nzClass: 'notification'
          }
        );
        this.dropboxLoginService.saveLoginTimestamp();
        this.dropboxIsLoggedIn = true;
      } else {
        this.notification.create(
          'error',
          'Nicht authorisiert',
          'Etwas ist schief gelaufen. Leider konnte WatchList nicht mit Ihrer Dropbox verknüpft werden.',
          {
            nzAnimate: true,
            nzClass: 'notification'
          }
        );
        this.dropboxIsLoggedIn = false;
      }
      this.dropboxIsVisible = false;
    } catch (error) {
      console.error(error);
      this.dropboxIsVisible = true;
      this.notification.create(
        'error',
        'Nicht authorisiert',
        'Etwas ist schief gelaufen. Leider konnte WatchList nicht mit Ihrer Dropbox verknüpft werden.',
        {
          nzAnimate: true,
          nzClass: 'notification'
        }
      );
      this.dropboxIsLoggedIn = false;
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
      const response = await axios.post(this.baseUrl + '/backups/store');
      const status = response.status;
      if (status === 200 || status === 201) {
        this.notification.create(
          'success',
          'Gesichert',
          'Backup wurde erfolgreich erstellt.',
          {
            nzAnimate: true,
            nzClass: 'notification'
          }
        );
      } else {
        this.notification.create(
          'error',
          'Backup fehlgeschlagen',
          'Etwas ist schief gelaufen. Leider konnte kein Backup erzeugt werden.',
          {
            nzAnimate: true,
            nzClass: 'notification'
          }
        );
      }
    } catch (error) {
      console.error(error);
      this.notification.create(
        'error',
        'Backup fehlgeschlagen',
        'Etwas ist schief gelaufen. Leider konnte kein Backup erzeugt werden.',
        {
          nzAnimate: true,
          nzClass: 'notification'
        }
      );
    }
  }

  async restoreFromDropbox() {
    try {
      const response = await axios.post(this.baseUrl + '/backups/restore');
      const status = response.status;
      if (status === 200 || status === 201) {
        this.notification.create(
          'success',
          'Wiederhergestellt',
          'Backup wurde erfolgreich eingespielt. Bitte laden Sie die Seite neu.',
          {
            nzAnimate: true,
            nzClass: 'notification'
          }
        );
      } else {
        this.notification.create(
          'error',
          'Wiederherstellen fehlgeschlagen',
          'Etwas ist schief gelaufen. Leider konnte keine Daten wiederhergestellt werden.',
          {
            nzAnimate: true,
            nzClass: 'notification'
          }
        );
      }
    } catch (error) {
      console.error(error);
      this.notification.create(
        'error',
          'Wiederherstellen fehlgeschlagen',
          'Etwas ist schief gelaufen. Leider konnte keine Daten wiederhergestellt werden.',
        {
          nzAnimate: true,
          nzClass: 'notification'
        }
      );
    }
  }

  async isMastodonAuthorized() {
    try {
      const response = await axios.get(this.baseUrl + '/mastodon/authorized');
      this.mastodonIsLoggedIn = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async logoutMastodon() {
    try {
      const response = await axios.post(this.baseUrl + '/mastodon/logout');
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
    if (!this.mastodonBaseUrl?.endsWith("/")) {
      this.mastodonBaseUrl = this.mastodonBaseUrl + "/";
    }
    this.mastodonFullUrl = this.mastodonBaseUrl + this.mastodonUrl;
    this.setMastodonProgress(1);
  }

  async handleMastodonOk(auth: any) {
    this.mastodonAuthCode = auth.mastodonAuthCode;
    const data = {
      "authorizationCode": this.mastodonAuthCode, 
      "mastodonUrl": this.mastodonBaseUrl
    };
    
    try {
      const response = await axios.post(this.baseUrl + '/mastodon/authorize', data);
      if (response.data) {
        this.notification.create(
          'success',
          'Authorisiert',
          'Sie haben WatchList erfolgreich mit Mastodon verknüpft.',
          {
            nzAnimate: true,
            nzClass: 'notification'
          }
        );
        this.mastodonIsLoggedIn = true;
        this.setMastodonProgress(2);
      } else {
        this.notification.create(
          'error',
          'Nicht authorisiert',
          'Etwas ist schief gelaufen. Leider konnte WatchList nicht mit Ihrem Mastodon Account verknüpft werden.',
          {
            nzAnimate: true,
            nzClass: 'notification'
          }
        );
        this.mastodonIsLoggedIn = false;
      }
    } catch (error) {
      console.error(error);
      this.mastodonIsVisible = true;
      this.notification.create(
        'error',
        'Nicht authorisiert',
        'Etwas ist schief gelaufen. Leider konnte WatchList nicht mit Ihrem Mastodon Account verknüpft werden.',
        {
          nzAnimate: true,
          nzClass: 'notification'
        }
      );
      this.mastodonIsLoggedIn = false;
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
