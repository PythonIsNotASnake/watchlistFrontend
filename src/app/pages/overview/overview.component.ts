import { Component, OnInit } from '@angular/core';
import axios, { Axios } from 'axios';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseApiService } from 'src/app/services/base.api.service';
import { DropboxLoginService } from 'src/app/services/dropbox.login.service';
import { AppConfigService } from '../../app.config.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})

export class OverviewComponent implements OnInit {

  public sortDirection = 'ASC';
  public sortValue = 'title';
  public start = 1;
  public limit = 10;
  public total = 10;
  public records: any[] = [];
  public genres = [];
  public filterTitle = '';

  public dropboxIsVisible = false;
  public dropboxIsLoggedIn = false;
  authCode?: string;

  public baseUrl = '';
  public dropboxUrl = '';
  public mastodonUrl = '';

  ngOnInit(): void {
    this.baseUrl = this.config.baseApi;
    this.dropboxUrl = this.config.dropboxUrl + "&client_id=" + this.config.dropboxClientId;
    this.mastodonUrl = this.config.mastodonUrl + "&client_id=" + this.config.mastodonClientId + "&redirect_uri=" + this.config.mastodonRedirectUri;

    this.getGenres();
    this.isDropboxAuthorized();
  }

  getGenres() {
    const axios = require('axios').default;
    const instance = axios.create({
      baseURL: this.baseUrl,
      timeout: 1000,
    });
    instance.get('/genres')
    .then((response: any) => {
      this.genres = response.data;
    })
    .catch(function (error: any) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }

  async deleteRecord(id: string) {
    const axios = require('axios').default;
    const instance = axios.create({
      baseURL: this.baseUrl,
    });
    try {
      await instance.delete('/records/' + id);
      this.loadDataFromServer(1, this.limit);
      this.notification.create(
        'success',
        'Gelöscht',
        'Eintrag wurde erfolgreich gelöscht.',
        {
          nzAnimate: true,
          nzClass: 'notification'
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
    const axios = require('axios').default;
    const instance = axios.create({
      baseURL: this.baseUrl,
    });
    instance.get('/records/?sortDirection=' + this.sortDirection + '&sortValue=' + this.sortValue + '&start=' + (pageIndex-1) + '&limit=' + pageSize + '&filterTitle=' + this.filterTitle)
    .then((response: any) => {
      this.records = response.data.data;
      this.total = response.data.total;
    })
    .catch(function (error: any) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }

  search(searchInput: any) {
    console.log(searchInput);
    this.filterTitle = searchInput.filterTitle;
    this.loadDataFromServer(1, 10);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.loadDataFromServer(pageIndex, pageSize);
  }

  isDropboxAuthorized(): void {
    this.dropboxIsLoggedIn = this.dropboxLoginService.isLoggedIn();
  }

  logoutDropbox() {
    this.dropboxLoginService.clearLoginTimestamp();
    this.dropboxIsLoggedIn = false;
  }

  async handleDropboxOk(auth: any) {
    this.authCode = auth.authCode;
    const data = {"authorizationCode": auth.authCode};
    
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

  constructor(
    private notification: NzNotificationService, 
    private config: AppConfigService, 
    private baseApi: BaseApiService, 
    private dropboxLoginService: DropboxLoginService) {}
  
}
