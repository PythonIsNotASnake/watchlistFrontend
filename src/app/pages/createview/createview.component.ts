import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import axios, { Axios } from 'axios';
import { AppConfigService } from '../../app.config.service';

@Component({
  selector: 'app-createview',
  templateUrl: './createview.component.html',
  styleUrls: ['./createview.component.css']
})
export class CreateviewComponent implements OnInit {

  safeSrc = {};
  public id: any;
  isUpdate: boolean = false;
  isLoading = false;
  title = "";
  description = "";
  genre = "";
  url = "";
  youtubeStartUrl = "https://www.youtube.com/embed/";

  public baseUrl = '';
  public dropboxUrl = '';
  public mastodonUrl = '';

  ngOnInit(): void {
    this.baseUrl = this.config.baseApi;
    this.dropboxUrl = this.config.dropboxUrl;
    this.mastodonUrl = this.config.mastodonUrl;

    this.route.paramMap.subscribe(params => {
      this.id = params.get("id")
    });

    if (this.id != null && this.id !== '') {
      this.isUpdate = true;
      this.getRecord(this.id);
    }

    console.log(this.isUpdate);

    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      'http://www.youtube.com/embed/' +
      '?enablejsapi=1'
      );
    const axios = require('axios').default;
  }

 async getRecord(id: String) {
    try {
      const response = await axios.get(this.baseUrl + '/records/' + id);
      console.log(response);
      this.title = response.data.title;
      this.description = response.data.description;
      this.genre = response.data.genre;
      var fullUrl: string;
      fullUrl = response.data.link;
      this.url = fullUrl.substring(29);
      this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        'http://www.youtube.com/embed/' +
        this.url +
        '?enablejsapi=1'
        );
    } catch (error) {
      console.error(error);
    }
 }

  async createRecord(record: any) {
    this.isLoading = true;
    const data = {"title": record.title, "description": record.description, "genre": record.genre, "link": this.youtubeStartUrl + record.url};
    
    try {
      const response = await axios.post(this.baseUrl + '/records', data);
      console.log(response);
      this.id = response.data.data.id;
      this.isLoading = false;
      this.notification.create(
        'success',
        'Erstellt',
        'Neuer Eintrag wurde erfolgreich erstellt.',
        {
          nzAnimate: true,
          nzClass: 'notification'
        }
      );
      this.router.navigate([`/detailview/${this.id}`], { relativeTo: this.route });
    } catch (error) {
      console.error(error);
      this.isLoading = false;
    }
  }

  async updateRecord(record: any) {
    this.isLoading = true;
    const data = {"title": record.title, "description": record.description, "genre": record.genre, "link": this.youtubeStartUrl + record.url};
    
    try {
      const response = await axios.put(this.baseUrl + '/records/' + this.id, data);
      console.log(response);
      this.isLoading = false;
      this.notification.create(
        'success',
        'Aktualisiert',
        'Eintrag wurde erfolgreich aktualisiert.',
        {
          nzAnimate: true,
          nzClass: 'notification'
        }
      );
      console.log("PUT navigate: " + this.id);
      this.router.navigate([`/detailview/${this.id}`], { relativeTo: this.route });
    } catch (error) {
      console.error(error);
      this.isLoading = false;
    }
  }

  preview(result: any) {
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      'http://www.youtube.com/embed/' + 
      result.url + 
      '?enablejsapi=1'
      );
  }

  constructor(
    private sanitizer: DomSanitizer, 
    private router: Router, 
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    private config: AppConfigService) {}

}
