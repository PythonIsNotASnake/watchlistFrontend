import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Axios } from 'axios';
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

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private config: AppConfigService) {}

}
