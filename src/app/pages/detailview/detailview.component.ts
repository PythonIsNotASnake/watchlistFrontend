import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import axios, { Axios } from 'axios';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AppConfigService } from '../../app.config.service';

@Component({
  selector: 'app-detailview',
  templateUrl: './detailview.component.html',
  styleUrls: ['./detailview.component.css']
})
export class DetailviewComponent implements OnInit {

  url = "";
  safeSrc = {};
  public id: any;
  title = "";
  description = "";
  genre = "";

  public baseUrl = '';
  mastodonIsLoggedIn = false;

  ngOnInit(): void {
    this.baseUrl = this.config.baseApi;

    this.route.paramMap.subscribe(params => {
      this.id = params.get("id")
    });
    const axios = require('axios').default;
    const instance = axios.create({
      baseURL: this.baseUrl,
    });

    this.getRecord(instance);
    this.isMastodonLoggedIn();
  }

  async getRecord(instance: any) {
    try {
      const response = await instance.get('/records/' + this.id);
      this.title = response.data.title;
      this.description = response.data.description;
      this.genre = response.data.genre;
      this.url = response.data.link;

      this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.url + '?enablejsapi=1');
    } catch (error) {
      console.error(error);
    }
  }

  async isMastodonLoggedIn() {
    try {
      const response = await axios.get(this.baseUrl + '/mastodon/authorized');
      this.mastodonIsLoggedIn = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async shareOnMastodon() {
    const data = {
      "recordId": this.id
    };
    try {
      const response = await axios.post(this.baseUrl + '/mastodon/toot', data);

      if (response.data) {
        this.notification.create(
          'success',
          'Toot',
          'Inhalt wurde auf Mastodon geteilt.',
          {
            nzAnimate: true,
            nzClass: 'notification'
          }
        );
      } else {
        this.notification.create(
          'error',
          'Nicht geteilt',
          'Inhalt konnte nicht auf Mastodon geteilt werden.',
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
        'Nicht geteilt',
        'Inhalt konnte nicht auf Mastodon geteilt werden.',
        {
          nzAnimate: true,
          nzClass: 'notification'
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
