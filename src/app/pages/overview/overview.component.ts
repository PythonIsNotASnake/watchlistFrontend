import { Component, OnInit } from '@angular/core';
import { Axios } from 'axios';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  public sortDirection = 'ASC';
  public sortValue = 'title';
  public start = 0;
  public limit = 10;
  public data = {};
  public genres = [];

  ngOnInit(): void {
    const axios = require('axios').default;
    const instance = axios.create({
      baseURL: 'http://localhost:8080',
      timeout: 1000,
      headers: {'X-Custom-Header': 'foobar'}
    });
    instance.get('/records/?sortDirection=' + this.sortDirection + '&sortValue=' + this.sortValue + '&start=' + this.start + '&limit=' + this.limit)
    .then((response: any) => {
      this.data = response;
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

  constructor() {
    const axios = require('axios').default;
    const instance = axios.create({
      baseURL: 'http://localhost:8080',
      timeout: 1000,
      headers: {'X-Custom-Header': 'foobar'}
    });

    const getPaginatedRecords = () => {
      instance.get('/records/?sortDirection=' + this.sortDirection + '&sortValue=' + this.sortValue + '&start=' + this.start + '&limit=' + this.limit)
      .then((response: any) => {
        this.data = response;
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

    const getGenres = () => {
      instance.get('/genres')
      .then((response: any) => {
        this.genres = response;
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
  }
  
}
