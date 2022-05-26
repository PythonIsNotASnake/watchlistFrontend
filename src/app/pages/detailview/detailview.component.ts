import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Axios } from 'axios';

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

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get("id")
    });
    const axios = require('axios').default;
    const instance = axios.create({
      baseURL: 'http://192.168.178.29:8080',
      //baseURL: 'http://localhost:8080',
      //headers: {'Access-Control-Allow-Origin': '*',
      //'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'}
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

      this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    } catch (error) {
      console.error(error);
    }
  }

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute) {}

}
