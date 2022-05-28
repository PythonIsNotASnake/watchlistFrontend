import { Component, OnInit } from '@angular/core';
import { Axios } from 'axios';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

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

  ngOnInit(): void {
    this.getGenres();
  }

  getGenres() {
    const axios = require('axios').default;
    const instance = axios.create({
      baseURL: 'http://192.168.178.29:8080',
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
      baseURL: 'http://192.168.178.29:8080',
    });
    try {
      await instance.delete('/records/' + id);
      this.loadDataFromServer(1, this.limit);
      this.notification.create(
        'success',
        'Deleted',
        'Successfully delete record.',
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
      baseURL: 'http://192.168.178.29:8080',
    });
    instance.get('/records/?sortDirection=' + this.sortDirection + '&sortValue=' + this.sortValue + '&start=' + (pageIndex-1) + '&limit=' + pageSize)
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

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.loadDataFromServer(pageIndex, pageSize);
  }

  constructor(private notification: NzNotificationService) {}
  
}
