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

  url = "https://www.youtube.com/embed/q2I0ulTZWXA";
  safeSrc: SafeResourceUrl;
  public id: any;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get("id")
    });
    const axios = require('axios').default;
    const instance = axios.create({
      baseURL: 'http://localhost:8080',
      timeout: 1000,
      headers: {'X-Custom-Header': 'foobar'}
    });
    instance.get('/records/' + this.id)
    .then(function (response: any) {
      // handle success
      console.log(response);
    })
    .catch(function (error: any) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute) { 
    this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

}
